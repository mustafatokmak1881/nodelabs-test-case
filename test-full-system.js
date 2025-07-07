const mongoose = require('mongoose');
const AutoMessage = require('./models/AutoMessage');
const Message = require('./models/Message');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI;

async function testFullSystem() {
  await mongoose.connect(MONGO_URI);
  
  console.log('=== OTOMATİK MESAJ SİSTEMİ TESTİ ===');
  
  // 1. Mevcut durumu kontrol et
  const users = await User.find({ isActive: true });
  console.log(`Aktif kullanıcı sayısı: ${users.length}`);
  
  const autoMessages = await AutoMessage.find();
  console.log(`Toplam AutoMessage sayısı: ${autoMessages.length}`);
  
  const messages = await Message.find();
  console.log(`Toplam Message sayısı: ${messages.length}`);
  
  // 2. Test için yeni AutoMessage oluştur (hemen gönderilecek)
  if (users.length >= 2) {
    const [sender, recipient] = users;
    const testAutoMessage = new AutoMessage({
      sender: sender._id,
      recipient: recipient._id,
      content: `Test otomatik mesaj - ${new Date().toISOString()}`,
      sendDate: new Date() // Hemen gönderilecek
    });
    await testAutoMessage.save();
    console.log(`Test AutoMessage oluşturuldu: ${testAutoMessage._id}`);
  }
  
  // 3. Kuyruğa alınmamış mesajları listele
  const pendingMessages = await AutoMessage.find({
    sendDate: { $lte: new Date() },
    isQueued: false
  });
  console.log(`Kuyruğa alınmayı bekleyen mesaj sayısı: ${pendingMessages.length}`);
  
  // 4. Gönderilmiş mesajları listele
  const sentMessages = await AutoMessage.find({ isSent: true });
  console.log(`Gönderilmiş AutoMessage sayısı: ${sentMessages.length}`);
  
  await mongoose.disconnect();
  console.log('Test tamamlandı!');
}

testFullSystem(); 