const mongoose = require('mongoose');
const cron = require('node-cron');
const User = require('../models/User');
const AutoMessage = require('../models/AutoMessage');

const MONGO_URI = process.env.MONGODB_URI;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function scheduleMessages() {
  try {
    // MongoDB bağlantı durumunu kontrol et
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI);
    }
    
    const users = await User.find({ isActive: true });
    if (users.length < 2) {
      console.log('Yeterli aktif kullanıcı yok.');
      return;
    }
    
    const shuffled = shuffle(users.slice());
    const pairs = [];
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      pairs.push([shuffled[i], shuffled[i + 1]]);
    }
    
    // Tek kişi kalırsa eşleşmez
    for (const [sender, recipient] of pairs) {
      const content = `Otomatik mesaj: ${Math.random().toString(36).substring(2, 10)}`;
      const sendDate = new Date(Date.now() + Math.floor(Math.random() * 3600 * 1000)); // 1 saat içinde rastgele
      await AutoMessage.create({
        sender: sender._id,
        recipient: recipient._id,
        content,
        sendDate
      });
      // Çift yönlü de eklenebilir:
      // await AutoMessage.create({ sender: recipient._id, recipient: sender._id, content, sendDate });
    }
    
    console.log('Otomatik mesajlar planlandı:', pairs.length);
  } catch (error) {
    console.error('Mesaj planlama hatası:', error);
  }
}

// Gerçek cron: '0 2 * * *' (her gece 02:00)
if (process.env.NODE_ENV !== 'test') {
  cron.schedule('* * * * *', scheduleMessages);
}

// Manuel test için
if (require.main === module) {
  scheduleMessages();
} 