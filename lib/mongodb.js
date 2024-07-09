// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI; // Ensure your .env file has MONGO_URI defined
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

export const connectToDatabase = async () => {
    if (!dbConnection) {
        await client.connect();
        dbConnection = client.db(); // Connects to the default database specified in the URI
    }
    return dbConnection;
};