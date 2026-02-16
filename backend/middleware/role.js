const { ROLE_PERMISSIONS } = require('../config/roles');

/**
 * Middleware to check if user has one of the required roles
 * @param {String[]} roles - Array of allowed roles
 */
exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado: No tienes el rol necesario' });
        }

        next();
    };
};

/**
 * Middleware to check if user has a specific permission
 * @param {String} module - Module name (e.g., 'ia', 'health')
 * @param {String} permission - Permission name (e.g., 'can_report')
 * @param {String|String[]} requiredValue - The value or values that match the permission
 */
exports.checkPermission = (module, permission, requiredValue) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        const userPermissions = ROLE_PERMISSIONS[req.user.role];
        if (!userPermissions || !userPermissions[module]) {
            return res.status(403).json({ message: 'Acceso denegado: Permisos insuficientes' });
        }

        const userValue = userPermissions[module][permission];

        if (Array.isArray(requiredValue)) {
            if (!requiredValue.includes(userValue)) {
                return res.status(403).json({ message: 'Acceso denegado: Valor de permiso no válido' });
            }
        } else if (userValue !== requiredValue) {
            return res.status(403).json({ message: 'Acceso denegado: Permiso insuficiente' });
        }

        next();
    };
};
