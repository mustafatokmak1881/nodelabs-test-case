const mongoose = require('mongoose');
const AutoMessage = require('./models/AutoMessage');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/nodelabs?authSource=admin';

async function main() {
  await mongoose.connect(MONGO_URI);
  let users = await User.find({ isActive: true }).limit(2);
  if (users.length < 2) {
    console.log('Test için en az 2 aktif kullanıcı gerekli.');
    process.exit(1);
  }
  const [sender, recipient] = users;
  const msg = new AutoMessage({
    sender: sender._id,
    recipient: recipient._id,
    content: 'Test otomatik mesaj',
    sendDate: new Date(Date.now() + 60 * 1000)
  });
  await msg.save();
  const found = await AutoMessage.findById(msg._id).populate('sender recipient');
  console.log('AutoMessage kaydı:', found);
  await mongoose.disconnect();
}

main(); 