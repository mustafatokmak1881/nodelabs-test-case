const mongoose = require('mongoose');
const cron = require('node-cron');
const amqp = require('amqplib');
const AutoMessage = require('../models/AutoMessage');
const User = require('../models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/nodelabs?authSource=admin';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password123@localhost:5672';

async function queueMessages() {
  await mongoose.connect(MONGO_URI);
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  
  // Kuyruk oluştur
  await channel.assertQueue('message_sending_queue', { durable: true });
  
  // Gönderim zamanı gelmiş ve henüz kuyruğa alınmamış mesajları bul
  const messages = await AutoMessage.find({
    sendDate: { $lte: new Date() },
    isQueued: false
  }).populate('sender recipient');
  
  console.log(`${messages.length} mesaj kuyruğa alınacak`);
  
  for (const msg of messages) {
    const messageData = {
      autoMessageId: msg._id.toString(),
      senderId: msg.sender._id.toString(),
      recipientId: msg.recipient._id.toString(),
      content: msg.content,
      sendDate: msg.sendDate
    };
    
    // RabbitMQ'ya gönder
    channel.sendToQueue('message_sending_queue', Buffer.from(JSON.stringify(messageData)), {
      persistent: true
    });
    
    // isQueued'ı true yap
    await AutoMessage.findByIdAndUpdate(msg._id, { isQueued: true });
    
    console.log(`Mesaj kuyruğa alındı: ${msg._id}`);
  }
  
  await channel.close();
  await connection.close();
  await mongoose.disconnect();
}

// Her dakika çalış
if (process.env.NODE_ENV !== 'test') {
  cron.schedule('* * * * *', queueMessages);
}

// Manuel test için
if (require.main === module) {
  queueMessages();
}

module.exports = { queueMessages }; 