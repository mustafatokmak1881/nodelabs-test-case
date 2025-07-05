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

// Insert sample data
db.users.insertOne({
    username: "admin",
    email: "admin@example.com",
    password: "hashed_password_here",
    createdAt: new Date(),
    updatedAt: new Date()
});

print("MongoDB initialization completed!"); 