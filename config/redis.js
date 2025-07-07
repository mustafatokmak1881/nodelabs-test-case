const redis = require('redis');

// Redis client configuration
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis Connected');
    } catch (error) {
        console.error('Redis connection error:', error.message);
        // Don't exit process, Redis is optional for online users count
    }
};

// Online users management
const ONLINE_USERS_KEY = 'online_users_count';
const ONLINE_USERS_SET = 'online_users_set';

// Set online users count
const setOnlineUsersCount = async (count) => {
    try {
        await redisClient.set(ONLINE_USERS_KEY, count.toString());
        console.log(`Online users count set to: ${count}`);
    } catch (error) {
        console.error('Error setting online users count:', error);
    }
};

// Get online users count
const getOnlineUsersCount = async () => {
    try {
        const count = await redisClient.get(ONLINE_USERS_KEY);
        return parseInt(count) || 0;
    } catch (error) {
        console.error('Error getting online users count:', error);
        return 0;
    }
};

// Increment online users count
const incrementOnlineUsers = async () => {
    try {
        const count = await redisClient.incr(ONLINE_USERS_KEY);
        console.log(`Online users count incremented to: ${count}`);
        return count;
    } catch (error) {
        console.error('Error incrementing online users count:', error);
        return 0;
    }
};

// Decrement online users count
const decrementOnlineUsers = async () => {
    try {
        const count = await redisClient.decr(ONLINE_USERS_KEY);
        // Ensure count doesn't go below 0
        if (count < 0) {
            await redisClient.set(ONLINE_USERS_KEY, '0');
            return 0;
        }
        console.log(`Online users count decremented to: ${count}`);
        return count;
    } catch (error) {
        console.error('Error decrementing online users count:', error);
        return 0;
    }
};

// Reset online users count
const resetOnlineUsersCount = async () => {
    try {
        await redisClient.set(ONLINE_USERS_KEY, '0');
        await redisClient.del(ONLINE_USERS_SET);
        console.log('Online users count and set reset to 0');
    } catch (error) {
        console.error('Error resetting online users count:', error);
    }
};

// Add user to online users set
const addOnlineUser = async (userId) => {
    try {
        await redisClient.sAdd(ONLINE_USERS_SET, userId.toString());
        console.log(`User ${userId} added to online users set`);
    } catch (error) {
        console.error('Error adding user to online users set:', error);
    }
};

// Remove user from online users set
const removeOnlineUser = async (userId) => {
    try {
        await redisClient.sRem(ONLINE_USERS_SET, userId.toString());
        console.log(`User ${userId} removed from online users set`);
    } catch (error) {
        console.error('Error removing user from online users set:', error);
    }
};

// Check if user is online
const isUserOnline = async (userId) => {
    try {
        const isOnline = await redisClient.sIsMember(ONLINE_USERS_SET, userId.toString());
        return isOnline;
    } catch (error) {
        console.error('Error checking if user is online:', error);
        return false;
    }
};

// Get all online users
const getOnlineUsers = async () => {
    try {
        const users = await redisClient.sMembers(ONLINE_USERS_SET);
        return users;
    } catch (error) {
        console.error('Error getting online users:', error);
        return [];
    }
};

module.exports = {
    connectRedis,
    redisClient,
    setOnlineUsersCount,
    getOnlineUsersCount,
    incrementOnlineUsers,
    decrementOnlineUsers,
    resetOnlineUsersCount,
    addOnlineUser,
    removeOnlineUser,
    isUserOnline,
    getOnlineUsers
}; 