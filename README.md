# NodeLabs Test Case

Bu proje Express.js, Socket.IO, MongoDB, Redis ve RabbitMQ kullanarak geliştirilmiş bir Node.js uygulamasıdır.

## 🚀 Docker ile Çalıştırma

## 📋 Postman Collection

Bu proje için hazırlanmış Postman collection'ı kullanarak tüm API endpoint'lerini kolayca test edebilirsiniz.

### Kurulum:
1. **Collection'ı İçe Aktar:**
   - Postman'de "Import" butonuna tıklayın
   - `NodeLabs_API_Collection.json` dosyasını seçin

2. **Environment'ı İçe Aktar:**
   - Postman'de "Import" butonuna tıklayın
   - `NodeLabs_Environment.json` dosyasını seçin
   - Environment'ı aktif hale getirin

3. **Test Sırası:**
   - **Register User** → Yeni kullanıcı kaydı
   - **Login User** → Giriş yap ve token al
   - **Get Current User** → Profil bilgilerini görüntüle
   - **Refresh Token** → Token'ı yenile
   - **Logout User** → Çıkış yap
   - **Get All Users** → Tüm kullanıcıları listele (admin gerekli)
   - **Send Message** → Yeni mesaj gönder
   - **Get User Conversations** → Kullanıcının konuşmalarını listele
   - **Get Conversation Messages** → Belirli konuşmanın mesajlarını görüntüle
   - **Mark Message as Read** → Mesajı okundu olarak işaretle

### Environment Variables:
- `base_url`: http://localhost:3000
- `auth_token`: Login sonrası otomatik doldurulur
- `username`, `email`, `password`: Test kullanıcı bilgileri
- `recipient_user_id`: Mesaj göndermek için alıcı kullanıcı ID'si
- `conversation_id`: Konuşma ID'si
- `message_id`: Mesaj ID'si

### Otomatik Token Yönetimi:
Login endpoint'inde "Tests" sekmesinde şu kodu ekleyin:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.data && response.data.token) {
        pm.environment.set("auth_token", response.data.token);
    }
}
```

Bu sayede login sonrası token otomatik olarak environment'a kaydedilir ve diğer endpoint'lerde kullanılır.

### Gereksinimler
- Docker
- Docker Compose

### Kurulum ve Çalıştırma

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd nodelabs-test-case
```

2. **Docker Compose ile servisleri başlatın:**
```bash
docker-compose up -d
```

3. **Servislerin durumunu kontrol edin:**
```bash
docker-compose ps
```

4. **Logları görüntüleyin:**
```bash
docker-compose logs -f app
```

### Erişim Bilgileri

- **Node.js Uygulaması:** http://localhost:3000
- **RabbitMQ Management:** http://localhost:15672
  - Kullanıcı adı: `admin`
  - Şifre: `password123`
- **MongoDB Express:** http://localhost:8081
  - Kullanıcı adı: `admin`
  - Şifre: `password123`
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379

### Servis Yönetimi

**Tüm servisleri durdurmak:**
```bash
docker-compose down
```

**Servisleri ve verileri tamamen silmek:**
```bash
docker-compose down -v
```

**Belirli bir servisi yeniden başlatmak:**
```bash
docker-compose restart app
```

**Servisleri yeniden oluşturmak:**
```bash
docker-compose up --build
```

## 📨 Mesaj Yönetimi API'leri

### Endpoint'ler

#### Mesaj Gönderme
- **POST** `/api/messages/send`
- **Body:**
  ```json
  {
    "content": "Mesaj içeriği",
    "recipientId": "alıcı_kullanıcı_id"
  }
  ```
- **Açıklama:** Yeni mesaj gönderir. Eğer konuşma yoksa otomatik oluşturur.

#### Konuşma Mesajlarını Listeleme
- **GET** `/api/messages/:conversationId?page=1&limit=50`
- **Query Parameters:**
  - `page`: Sayfa numarası (varsayılan: 1)
  - `limit`: Sayfa başına mesaj sayısı (varsayılan: 50)
- **Açıklama:** Belirli konuşmanın mesajlarını sayfalama ile listeler.

#### Kullanıcı Konuşmalarını Listeleme
- **GET** `/api/conversations?page=1&limit=20`
- **Query Parameters:**
  - `page`: Sayfa numarası (varsayılan: 1)
  - `limit`: Sayfa başına konuşma sayısı (varsayılan: 20)
- **Açıklama:** Kullanıcının tüm konuşmalarını listeler.

#### Mesajı Okundu Olarak İşaretleme
- **PUT** `/api/messages/:messageId/read`
- **Açıklama:** Belirli mesajı okundu olarak işaretler.

### Kullanım Örneği

1. **İki kullanıcı oluşturun ve giriş yapın**
2. **İlk kullanıcı ile mesaj gönderin:**
   ```json
   POST /api/messages/send
   {
     "content": "Merhaba!",
     "recipientId": "ikinci_kullanıcı_id"
   }
   ```
3. **Konuşmaları listeleyin:**
   ```json
   GET /api/conversations
   ```
4. **Mesajları görüntüleyin:**
   ```json
   GET /api/messages/conversation_id
   ```

## 📁 Proje Yapısı

```
nodelabs-test-case/
├── controllers/          # Controller dosyaları
├── frontend/            # Frontend dosyaları
│   └── www/
│       └── index.html
├── middlewares/         # Middleware dosyaları
├── routes/              # Route dosyaları
├── index.js             # Ana uygulama dosyası
├── Dockerfile           # Docker image tanımı
├── docker-compose.yml   # Docker Compose konfigürasyonu
├── mongo-init.js        # MongoDB başlangıç scripti
├── healthcheck.js       # Health check scripti
└── package.json         # Node.js bağımlılıkları
```

## 🔧 Geliştirme

### Yerel Geliştirme Ortamı

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Uygulamayı başlatın:**
```bash
npm start
```

### Environment Variables

Uygulama aşağıdaki environment variable'ları kullanır:

- `PORT`: Uygulama portu (varsayılan: 3000)
- `MONGODB_URI`: MongoDB bağlantı URI'si
- `REDIS_URL`: Redis bağlantı URL'si
- `RABBITMQ_URL`: RabbitMQ bağlantı URL'si

## 📊 Monitoring

- **Health Check:** Docker container'ları otomatik olarak health check yapar
- **Logs:** `docker-compose logs` komutu ile logları görüntüleyebilirsiniz
- **Metrics:** RabbitMQ Management UI'dan queue metriklerini takip edebilirsiniz

## 🛠️ Troubleshooting

### Yaygın Sorunlar

1. **Port çakışması:** Eğer portlar kullanımdaysa, `docker-compose.yml` dosyasından port mapping'leri değiştirin.

2. **MongoDB bağlantı hatası:** MongoDB'nin tamamen başlamasını bekleyin.

3. **Redis bağlantı hatası:** Redis container'ının çalıştığından emin olun.

### Log Kontrolü

```bash
# Tüm servislerin logları
docker-compose logs

# Belirli servisin logları
docker-compose logs app
docker-compose logs mongodb
docker-compose logs redis
docker-compose logs rabbitmq
```