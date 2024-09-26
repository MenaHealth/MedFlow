// app/api/patient/test.js
import { connectToDatabase } from '@/lib/mongodb';  

export default async function handler(req, res) {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const client = await connectToDatabase();
    
    const db = client.db('med_flow');
    
    console.log('Successfully connected to MongoDB');
    
    res.status(200).json({ message: 'MongoDB connection successful' });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ error: 'Failed to connect to MongoDB', details: error.message });
  }
}
