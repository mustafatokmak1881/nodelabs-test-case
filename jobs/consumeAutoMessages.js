const mongoose = require('mongoose');
const amqp = require('amqplib');
const AutoMessage = require('../models/AutoMessage');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const MONGO_URI = process.env.MONGODB_URI;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password123@localhost:5672';

let io = null;

function setSocketIO(socketIO) {
  io = socketIO;
}

async function processMessage(messageData) {
  try {
    // MongoDB bağlantı durumunu kontrol et
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI);
    }
    
    const { autoMessageId, senderId, recipientId, content } = messageData;
    
    // Conversation bul veya oluştur
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
      isActive: true
    });
    
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId]
      });
      await conversation.save();
    }
    
    // Gerçek Message kaydını oluştur
    const message = new Message({
      conversationId: conversation._id,
      sender: senderId,
      content: content
    });
    
    await message.save();
    
    // Conversation'ı güncelle
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();
    
    // AutoMessage'ı isSent=true yap
    await AutoMessage.findByIdAndUpdate(autoMessageId, { isSent: true });
    
    // Socket.IO ile alıcıya bildirim gönder
    if (io) {
      const populatedMessage = await Message.findById(message._id).populate('sender', 'username');
      io.to(`user_${recipientId}`).emit('message_received', {
        message: populatedMessage,
        conversationId: conversation._id
      });
    }
    
    console.log(`Mesaj gönderildi: ${message._id} -> ${recipientId}`);
    
  } catch (error) {
    console.error('Mesaj işleme hatası:', error);
  }
}

async function startConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    await channel.assertQueue('message_sending_queue', { durable: true });
    
    console.log('RabbitMQ consumer başlatıldı. Mesajlar bekleniyor...');
    
    channel.consume('message_sending_queue', async (msg) => {
      if (msg) {
        const messageData = JSON.parse(msg.content.toString());
        console.log('Mesaj alındı:', messageData);
        
        await processMessage(messageData);
        
        channel.ack(msg);
      }
    });
    
  } catch (error) {
    console.error('Consumer başlatma hatası:', error);
  }
}

// Manuel test için
if (require.main === module) {
  startConsumer();
}

module.exports = { startConsumer, setSocketIO }; 