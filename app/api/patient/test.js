// app/api/patient/test.js
import { connectToDatabase } from '@/lib/mongodb';  // Import your MongoDB connection function

export default async function handler(req, res) {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Connect to the MongoDB database
    const client = await connectToDatabase();
    
    // Choose the correct database (this should match your db name)
    const db = client.db('med_flow');
    
    console.log('Successfully connected to MongoDB');
    
    // Return a success message
    res.status(200).json({ message: 'MongoDB connection successful' });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Return an error if the connection failed
    res.status(500).json({ error: 'Failed to connect to MongoDB', details: error.message });
  }
}
