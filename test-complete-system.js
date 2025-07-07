const mongoose = require('mongoose');
const AutoMessage = require('./models/AutoMessage');
const Message = require('./models/Message');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI;

async function testCompleteSystem() {
  await mongoose.connect(MONGO_URI);

  console.log('=== TAM SİSTEM TESTİ (3 KEZ) ===');

  for (let test = 1; test <= 3; test++) {
    console.log(`\n--- TEST ${test} ---`);

    // Başlangıç durumu
    const initialMessages = await Message.find().countDocuments();
    const initialAutoMessages = await AutoMessage.find().countDocuments();

    // 1. Planlama: Yeni AutoMessage oluştur
    const users = await User.find({ isActive: true }).limit(2);
    if (users.length >= 2) {
      const [sender, recipient] = users;
      const testAutoMessage = new AutoMessage({
        sender: sender._id,
        recipient: recipient._id,
        content: `Test ${test} - ${new Date().toISOString()}`,
        sendDate: new Date() // Hemen gönderilecek
      });
      await testAutoMessage.save();
      console.log(`✓ Test ${test} AutoMessage oluşturuldu: ${testAutoMessage._id}`);
    }

    // 2. Kuyruğa Alma: Bekleyen mesajları kuyruğa al
    const pendingMessages = await AutoMessage.find({
      sendDate: { $lte: new Date() },
      isQueued: false
    });
    console.log(`✓ Test ${test} kuyruğa alınacak mesaj: ${pendingMessages.length}`);

    // 3. İşleme: Consumer'ın mesajı işlemesini bekle
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle

    // 4. Sonuçları kontrol et
    const finalMessages = await Message.find().countDocuments();
    const finalAutoMessages = await AutoMessage.find().countDocuments();
    const sentAutoMessages = await AutoMessage.find({ isSent: true }).countDocuments();

    console.log(`✓ Test ${test} sonuçları:`);
    console.log(`  - Message sayısı: ${initialMessages} → ${finalMessages} (${finalMessages - initialMessages > 0 ? '✓' : '✗'})`);
    console.log(`  - AutoMessage sayısı: ${initialAutoMessages} → ${finalAutoMessages} (${finalAutoMessages - initialAutoMessages > 0 ? '✓' : '✗'})`);
    console.log(`  - Gönderilmiş AutoMessage: ${sentAutoMessages}`);

    if (finalMessages > initialMessages && finalAutoMessages > initialAutoMessages) {
      console.log(`✓ Test ${test} BAŞARILI!`);
    } else {
      console.log(`✗ Test ${test} BAŞARISIZ!`);
    }
  }

  await mongoose.disconnect();
  console.log('\n=== TÜM TESTLER TAMAMLANDI ===');
}

testCompleteSystem(); 