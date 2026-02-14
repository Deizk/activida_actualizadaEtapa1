const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const startServer = async () => {
    try {
        let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/banco-obrero';

        // Attempt to connect to local/env URI first
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
            console.log('Connected to MongoDB (Standard)');
        } catch (err) {
            console.log('Could not connect to standard MongoDB, attempting to start in-memory server...');
            try {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                const mongod = await MongoMemoryServer.create();
                uri = mongod.getUri();
                await mongoose.connect(uri);
                console.log('Connected to MongoDB (In-Memory)');
            } catch (memErr) {
                console.error('Failed to start in-memory MongoDB:', memErr);
                throw err; // Throw original error if memory server also fails
            }
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

startServer();
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
