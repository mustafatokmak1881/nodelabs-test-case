const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:password123@localhost:5672';

async function testRabbitMQ() {
  try {
    console.log('RabbitMQ bağlantısı test ediliyor...');
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log('✓ RabbitMQ bağlantısı başarılı!');
    
    const channel = await connection.createChannel();
    console.log('✓ Channel oluşturuldu!');
    
    await channel.assertQueue('message_sending_queue', { durable: true });
    console.log('✓ Kuyruk oluşturuldu!');
    
    // Kuyrukta kaç mesaj var kontrol et
    const queueInfo = await channel.checkQueue('message_sending_queue');
    console.log(`✓ Kuyrukta ${queueInfo.messageCount} mesaj var`);
    
    await channel.close();
    await connection.close();
    console.log('✓ Bağlantı kapatıldı!');
    
  } catch (error) {
    console.error('✗ RabbitMQ hatası:', error.message);
  }
}

testRabbitMQ(); 