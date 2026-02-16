const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ROLES, ROLE_PERMISSIONS } = require('../config/roles');

// Real API function
const axios = require('axios');

const fetchCedulaData = async (cedula) => {
    try {
        // Extract numbers only
        const number = cedula.replace(/\D/g, '');
        // Default to 'V' if not explicitly stated as 'E'
        const type = cedula.toUpperCase().startsWith('E') ? 'E' : 'V';

        console.log(`[Backend API] Requesting data for ${type}-${number}...`);

        const response = await axios.get('https://api.cedula.com.ve/api/v1', {
            params: {
                app_id: '1963',
                token: '2fe9b2e9006405bc8c8b47f5871f7cd8',
                nacionalidad: type,
                cedula: number
            }
        });

        if (response.data && response.data.error === false && response.data.data) {
            const d = response.data.data;

            // Map names from the exact API structure verified:
            // primer_nombre, segundo_nombre, primer_apellido, segundo_apellido
            const firstName = [d.primer_nombre, d.segundo_nombre].filter(Boolean).join(' ');
            const lastName = [d.primer_apellido, d.segundo_apellido].filter(Boolean).join(' ');

            return {
                name: firstName.trim(),
                surname: lastName.trim()
            };
        }
        return null;
    } catch (error) {
        console.error("API Error:", error.message);
        return null;
    }
};

exports.checkCedula = async (req, res) => {
    try {
        const { cedula } = req.body;

        if (!cedula) {
            return res.status(400).json({ message: "Cédula es requerida" });
        }

        // 1. Check local DB
        const existingUser = await User.findOne({ cedula });
        if (existingUser) {
            return res.json({
                exists: true,
                message: "Usuario ya registrado",
                user: {
                    name: existingUser.name,
                    surname: existingUser.surname
                }
            });
        }

        // 2. Check "External API" (Real Only - No Mocks)
        const apiData = await fetchCedulaData(cedula);
        console.log("Check-Cedula final apiData:", JSON.stringify(apiData));

        if (apiData) {
            return res.json({
                exists: false,
                message: "Usuario no registrado, datos encontrados",
                data: apiData
            });
        } else {
            return res.json({
                exists: false,
                message: "Usuario no registrado, datos no encontrados",
                data: null
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

exports.register = async (req, res) => {
    try {
        const { cedula, name, surname, password } = req.body;

        // Check again if exists
        let user = await User.findOne({ cedula });
        if (user) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            cedula,
            name,
            surname,
            password: hashedPassword
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        surname: user.surname,
                        cedula: user.cedula,
                        role: user.role,
                        permissions: ROLE_PERMISSIONS[user.role]
                    }
                });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar" });
    }
};

exports.login = async (req, res) => {
    try {
        const { cedula, password } = req.body;

        let user = await User.findOne({ cedula });
        if (!user) {
            // Security: don't reveal if user exists? 
            // The check-cedula endpoint already reveals it, so it doesn't matter much here.
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        surname: user.surname,
                        cedula: user.cedula,
                        role: user.role,
                        permissions: ROLE_PERMISSIONS[user.role]
                    }
                });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};
