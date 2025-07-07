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

- **Ana Uygulama (Frontend + Backend):** http://localhost:3000
  - Frontend ve backend aynı port üzerinden serve edilir
  - API endpoint'leri: http://localhost:3000/api
  - Swagger Dokümantasyonu: http://localhost:3000/api-docs
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

### Tek Sayfa Uygulaması (SPA)
- **Unified Application**: Frontend ve backend aynı port üzerinden serve edilir
- **Single Entry Point**: http://localhost:3000 adresinden tüm uygulamaya erişim
- **SPA Routing**: Tüm route'lar frontend tarafından handle edilir

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

### API Entegrasyonu
- **RESTful API**: Tüm frontend işlemleri backend API'si üzerinden yapılır
- **Swagger Desteği**: API dokümantasyonu http://localhost:3000/api-docs adresinden erişilebilir
- **Error Handling**: Kapsamlı hata yönetimi ve kullanıcı bildirimleri

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

## 📝 Swagger API Dokümantasyonu

Projenin tüm API uç noktalarını interaktif olarak incelemek ve test etmek için Swagger/OpenAPI arayüzünü kullanabilirsiniz.

### Swagger UI'ya Erişim

- Tarayıcıdan şu adrese gidin: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Veya ana uygulama üzerinden: http://localhost:3000 → API Documentation linki

### Özellikler
- Tüm endpoint'ler, parametreler, örnek istek/yanıtlar ve model şemaları interaktif olarak görüntülenebilir.
- JWT Bearer token ile korunan endpoint'ler için "Authorize" butonunu kullanarak token ile test yapabilirsiniz.
- Her endpoint için açıklama, örnek, hata durumları ve model referansları Swagger arayüzünde yer alır.
- Frontend ve backend aynı port üzerinden serve edildiği için CORS sorunları yaşanmaz.

### Kullanım Adımları
1. Sunucuyu başlatın (`docker-compose up` veya `npm start`)
2. Tarayıcıda [http://localhost:3000/api-docs](http://localhost:3000/api-docs) adresine gidin
3. İlgili endpoint'i seçin, parametreleri doldurun ve "Try it out" ile test edin

Swagger/OpenAPI dokümantasyonu sayesinde API'nizi kolayca keşfedebilir ve test edebilirsiniz.

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

## 📊 İstatistik API'leri

### Online Kullanıcı Sayısı
- **GET** `/api/stats/online-users`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "onlineUsers": 5,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  }
  ```
- **Açıklama:** Anlık online kullanıcı sayısını döndürür.

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

## 🤖 Otomatik Sistem Süreçleri

Bu bölüm projenin en kritik kısımlarından biridir ve zamanlanmış görev yönetimi ile asenkron işlem becerilerini test etmeyi amaçlar. Sistem, üç ayrı ve yönetilebilir aşamada çalışır: **Planlama**, **Kuyruğa Alma** ve **İşleme**.

### 1. Adım: Mesaj Planlama Servisi (Cron Job - Gece 02:00)

**Amaç:** Aktif kullanıcıları otomatik olarak eşleştirerek gönderilecek mesajları toplu halde hazırlamak.

**İşlem Süreci:**
- Her gece saat 02:00'da otomatik olarak tetiklenir
- Veritabanındaki tüm aktif kullanıcıları çeker
- Kullanıcı listesini rastgele karıştırır (shuffle algoritması)
- Karıştırılmış listeyi ikişerli gruplara ayırarak (gönderici, alıcı) çiftleri oluşturur
- Her çift için rastgele mesaj içeriği hazırlar
- Gönderim için gelecek tarih (sendDate) belirler
- Tüm bilgileri AutoMessage koleksiyonuna kaydeder

**Manuel Çalıştırma:**
```bash
# Docker container içinde
docker-compose exec app npm run schedule-auto-messages

# Veya doğrudan
node jobs/scheduleAutoMessages.js
```

### 2. Adım: Kuyruk Yönetimi Servisi (Worker Cron Job - Dakikada Bir)

**Amaç:** Gönderim zamanı gelen mesajları tespit edip RabbitMQ sistemine yönlendirmek.

**İşlem Süreci:**
- Her dakika otomatik olarak çalışır
- AutoMessage koleksiyonunda sendDate'i geçmiş ve isQueued: false olan mesajları arar
- Tespit edilen mesajları RabbitMQ'daki message_sending_queue kuyruğuna gönderir
- Aynı mesajın tekrar işlenmemesi için AutoMessage kaydını isQueued: true olarak günceller

**Manuel Çalıştırma:**
```bash
# Docker container içinde
docker-compose exec app npm run queue-auto-messages

# Veya doğrudan
node jobs/queueAutoMessages.js
```

### 3. Adım: Mesaj Dağıtım Servisi (RabbitMQ Consumer)

**Amaç:** Kuyruktaki mesajları işleyerek alıcılara ulaştırmak.

**İşlem Süreci:**
- message_sending_queue kuyruğunu sürekli dinler
- Kuyruğa gelen görevleri anında alır ve işler
- Görev bilgilerine göre yeni Message dökümanı oluşturur ve veritabanına kaydeder
- Socket.IO üzerinden alıcıya message_received eventi ile anlık bildirim gönderir
- AutoMessage kaydını isSent: true olarak güncelleyerek işlemi tamamlar

**Manuel Çalıştırma:**
```bash
# Docker container içinde
docker-compose exec app npm run consume-auto-messages

# Veya doğrudan
node jobs/consumeAutoMessages.js
```

**Sistem Avantajları:**
Bu üç aşamalı yapı sayesinde görevlerin zamanlanması, işleme alınacakların tespiti ve gerçek gönderim işlemlerinin birbirinden ayrıştırılması sağlanır. Bu yaklaşım ölçeklenebilir, hataya dayanıklı ve yönetilebilir bir otomatik mesajlaşma sistemi oluşturur.

## 👥 Online Kullanıcı Takip Sistemi

Bu sistem Socket.IO ve Redis teknolojilerini kullanarak kullanıcıların online durumlarını gerçek zamanlı olarak takip eder.

### Kullanıcı Bağlantı Yönetimi

**Kullanıcı Sisteme Bağlandığında (connection eventi):**
- Socket.IO üzerinden gelen bağlantı JWT token ile doğrulanır
- Kimlik doğrulaması başarılı olan kullanıcı Redis'teki online kullanıcılar listesine (Set veri yapısı) eklenir
- Diğer kullanıcılara kullanıcının online olduğu bilgisi broadcast edilir

**Kullanıcı Sistemden Ayrıldığında (disconnect eventi):**
- Bağlantısı kesilen kullanıcının kimliği Redis'teki online listesinden kaldırılır
- Diğer kullanıcılara kullanıcının offline olduğu bilgisi iletilir

### Online Durum Sorguları

**Anlık Online Kullanıcı Sayısı:**
```bash
GET /api/stats/online-users
```
Redis'teki online kullanıcılar Set'inin eleman sayısı sorgulanarak anlık online kullanıcı sayısı alınır.

**Belirli Kullanıcının Online Durumu:**
```bash
GET /api/stats/user-online/:userId
```
Redis Set'inde belirli bir kullanıcı ID'sinin varlığı kontrol edilerek o kullanıcının online/offline durumu tespit edilir.

**Online Kullanıcı Listesi:**
```bash
GET /api/stats/online-users-list
```
Bir test endpointi ile istatistik amaçlı Redis Set'indeki tüm online kullanıcı ID'leri listelenir.

### API Response Örnekleri

**Online Kullanıcı Sayısı:**
```json
{
  "success": true,
  "data": {
    "onlineUsers": 3,
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

**Belirli Kullanıcının Online Durumu:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "isOnline": true,
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

**Online Kullanıcı Listesi:**
```json
{
  "success": true,
  "data": {
    "onlineUsers": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    "count": 2,
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

### Test Senaryoları

1. **Online Kullanıcı Sayısı Testi:**
   ```bash
   # Kullanıcı kaydı yap
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
   
   # Login yap ve token al
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'
   
   # Online kullanıcı sayısını kontrol et
   curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/stats/online-users
   ```

2. **Otomatik Mesaj Sistemi Testi:**
   ```bash
   # Manuel olarak mesaj planla
   docker-compose exec app npm run schedule-auto-messages
   
   # Kuyruğa al
   docker-compose exec app npm run queue-auto-messages
   
   # Consumer'ı başlat (zaten çalışıyor olmalı)
   docker-compose exec app npm run consume-auto-messages
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
- **online_users_count**: Online kullanıcı sayısı güncellendiğinde
  ```javascript
  { count: 5 }
  ```
- **new_user_registered**: Yeni kullanıcı kaydı yapıldığında
  ```javascript
  {
    user: {
      id: "user_id",
      username: "kullanıcı_adı",
      email: "email@example.com",
      role: "user",
      isActive: true,
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  }
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