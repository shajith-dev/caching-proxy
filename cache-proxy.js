import { createClient } from "redis";
import express from "express";
import axios from "axios";

const PORT = process.argv[2] || 8080;
const REDIS_CACHE_EXPIRY = process.argv[3] || 60; // Default to 60 seconds
const API_URL = process.argv[4] || "http://dummyjson.com";

// Create and configure Redis client
const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.memo

// Connect to Redis
await redisClient.connect();

// Initialize Express app
const app = express();
app.use(express.json());

// Function to fetch data from Redis or API
const getData = async (request) => {
  const cachedData = await redisClient.get(request);
  if (cachedData) {
    return { data: JSON.parse(cachedData), source: "Cache" };
  }

  const response = await axios.get(`${API_URL}/${request}`);
  const data = response.data;

  // Cache the API response in Redis
  await redisClient.setEx(request, REDIS_CACHE_EXPIRY, JSON.stringify(data));
  return { data, source: "API" };
};

// Route to fetch products
app.get("/:endpoint", async (req, res, next) => {
  try {
    const { endpoint } = req.params;
    const result = await getData(endpoint);
    res.json(result);
  } catch (error) {
    next(error); // Forward error to middleware
  }
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
