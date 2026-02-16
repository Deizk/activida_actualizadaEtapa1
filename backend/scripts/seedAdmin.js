const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('Error: MONGODB_URI no definida en .env');
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log('Conectado a MongoDB...');

        const adminCedula = 'V12345678';
        const existingAdmin = await User.findOne({ cedula: adminCedula });

        if (existingAdmin) {
            console.log('El usuario admin ya existe.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = new User({
            cedula: adminCedula,
            name: 'Admin',
            surname: 'Obrero',
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Usuario Admin creado exitosamente:');
        console.log('Cédula:', adminCedula);
        console.log('Password: admin123');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error al crear el admin:', error);
        process.exit(1);
    }
};

seedAdmin();
