# NodeLabs Test Case

Bu proje Express.js, Socket.IO, MongoDB, Redis ve RabbitMQ kullanarak geliştirilmiş bir Node.js uygulamasıdır.

## 🚀 Docker ile Çalıştırma

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
- **Frontend:** http://localhost:3000 (aynı port)
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

## 🌐 Frontend Özellikleri

### Real-time Mesajlaşma
- **Socket.IO entegrasyonu**: Anlık mesaj gönderme/alma
- **Online/Offline durumu**: Kullanıcıların bağlantı durumu
- **Yeni mesaj uyarısı**: Aktif konuşmada olmayan mesajlar için yanıp sönen uyarı
- **Kullanıcı seçimi**: Sağ sidebar'dan kullanıcı seçerek direkt mesajlaşma

### Kullanıcı Arayüzü
- **Responsive tasarım**: Mobil ve masaüstü uyumlu
- **Modern UI**: Bootstrap 5 ile güzel görünüm
- **Kullanıcı listesi**: Online/offline durumu ile birlikte
- **Konuşma geçmişi**: Tüm mesajların görüntülenmesi
- **Gerçek zamanlı güncellemeler**: Mesajlar ve kullanıcı durumları anlık güncellenir

### Güvenlik
- **JWT authentication**: Güvenli token tabanlı kimlik doğrulama
- **Kullanıcı filtreleme**: Kullanıcı listesinde kendiniz görünmez
- **Otomatik token yenileme**: Token süresi dolduğunda otomatik yenileme

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
Postman collection'ında Login ve Refresh Token endpoint'lerine otomatik token yönetimi eklenmiştir. Login yaptıktan sonra token otomatik olarak environment'a kaydedilir ve diğer endpoint'lerde kullanılır.

Bu sayede login sonrası token otomatik olarak environment'a kaydedilir ve diğer endpoint'lerde kullanılır.

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

## 🔌 Socket.IO Events

### Client Events (Frontend → Backend)
- **Connection**: Socket.IO bağlantısı kurulur
- **Disconnect**: Bağlantı kesilir

### Server Events (Backend → Frontend)
- **new_message**: Yeni mesaj geldiğinde
  ```javascript
  {
    conversationId: "conversation_id",
    message: {
      id: "message_id",
      content: "Mesaj içeriği",
      sender: { _id: "user_id", username: "kullanıcı_adı" },
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **user_online**: Kullanıcı online olduğunda
  ```javascript
  { userId: "user_id" }
  ```
- **user_offline**: Kullanıcı offline olduğunda
  ```javascript
  { userId: "user_id" }
  ```

### Frontend Socket.IO Kullanımı
```javascript
// Bağlantı kurma
const socket = io('http://localhost:3000', {
  auth: { token: 'jwt_token' }
});

// Yeni mesaj dinleme
socket.on('new_message', (data) => {
  console.log('Yeni mesaj:', data.message);
});

// Kullanıcı durumu dinleme
socket.on('user_online', (data) => {
  console.log('Kullanıcı online:', data.userId);
});
```

## 🛠️ Troubleshooting

### Yaygın Sorunlar

1. **Port çakışması:** Eğer portlar kullanımdaysa, `docker-compose.yml` dosyasından port mapping'leri değiştirin.

2. **MongoDB bağlantı hatası:** MongoDB'nin tamamen başlamasını bekleyin.

3. **Redis bağlantı hatası:** Redis container'ının çalıştığından emin olun.

4. **Socket.IO bağlantı hatası:** JWT token'ın geçerli olduğundan emin olun.

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