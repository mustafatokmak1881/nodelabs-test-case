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

// Online users count management
const ONLINE_USERS_KEY = 'online_users_count';

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
        console.log('Online users count reset to 0');
    } catch (error) {
        console.error('Error resetting online users count:', error);
    }
};

module.exports = {
    connectRedis,
    redisClient,
    setOnlineUsersCount,
    getOnlineUsersCount,
    incrementOnlineUsers,
    decrementOnlineUsers,
    resetOnlineUsersCount
}; 