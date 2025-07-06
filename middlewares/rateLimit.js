const rateLimit = require('express-rate-limit');

// Genel rate limit: Her IP için 15 dakikada 100 istek
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100,
    standardHeaders: true, // RateLimit-* başlıklarını döndür
    legacyHeaders: false, // X-RateLimit-* başlıklarını döndürme
    message: {
        success: false,
        message: 'Çok fazla istek yaptınız, lütfen daha sonra tekrar deneyin.'
    }
});

module.exports = apiLimiter; 