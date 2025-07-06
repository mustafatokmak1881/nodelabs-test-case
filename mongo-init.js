// MongoDB initialization script
db = db.getSiblingDB('nodelabs');

// Create collections
db.createCollection('users');
db.createCollection('messages');
db.createCollection('sessions');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.messages.createIndex({ "timestamp": 1 });
db.sessions.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });


print("MongoDB initialization completed!"); 