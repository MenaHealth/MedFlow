import { MongoClient } from 'mongodb';

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("MongoDB connected"); // Log when connected
    cachedClient = client;
    return client;
  } catch (err) {
    console.error("MongoDB connection error:", err); // Log error
    throw new Error("MongoDB connection failed");
  }
}
