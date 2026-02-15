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
    // Validación de Producción
    if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
        console.error("FATAL ERROR: MONGODB_URI is missing in production environment.");
        process.exit(1);
    }

    let uri = process.env.MONGODB_URI;
    let isInMemory = false; // NUEVA VARIABLE DE CONTROL

    try {
        // Lógica para entorno de Desarrollo/Test sin URI
        if (!uri && (process.env.NODE_ENV !== 'production')) {
            console.log('No Standard MongoDB URI found. Starting In-Memory cluster (DEV/TEST ONLY)...');
            
            // Requerimos la librería aquí para no cargarla en producción innecesariamente
            const { MongoMemoryServer } = require('mongodb-memory-server');
            
            // Creamos la instancia
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            
            isInMemory = true; // MARCAMOS QUE ESTAMOS EN MEMORIA
        }
        
        // Validación final de URI
        if (!uri) {
            throw new Error("MongoDB URI is undefined.");
        }

        // Conexión
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });

        // Usamos la variable booleana, para verificar el entorno de base de datos que se ejecuta.
        const connectionType = isInMemory ? 'IN-MEMORY' : 'STANDARD';
        console.log(`Connected to MongoDB [${connectionType}]`);
        // Opcional: Imprimir la URI completa en desarrollo para ver el puerto rea, ye vitar errores.
        if (process.env.NODE_ENV !== 'production') console.log(`URI: ${uri}`);

    } catch (err) {
        console.error("MongoDB connection error:", err);
        
        if (process.env.NODE_ENV === "production") {
            process.exit(1);
        }
        // En desarrollo no hacemos exit(1) para ver el error sin matar la terminal si usamos nodemon o watch
        // pero lanzamos el error para que quien llame a startServer lo sepa.
        throw err;
    }
};

const startApp = async () => {
    try {
        // Primero conectamos la BD
        await startServer(); // Tu función de conexión a Mongo
        
        // SOLO si la BD conecta, levantamos el servidor Express
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start application:", error);
        process.exit(1);
    }
};

startApp();

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('API is running');
});
