const ROLES = {
    NATURAL: 'natural',
    GOBIERNO: 'gobierno',
    ADMIN: 'admin',
    MANTENIMIENTO: 'mantenimiento'
};

const ROLE_PERMISSIONS = {
    [ROLES.NATURAL]: {
        ia: { decision: 'result_only', can_report: true, emergency: 'panic_only' },
        health: { access: 'own_history' },
        governance: { impact: 'transparency_view' },
        market: { general: 'buy', my_business: 'seller_only' },
        democracy: { can_vote: true, history: 'own_only' },
        volunteering: { tasks: 'assigned_only' },
        user: { profile: 'own_only', add_children: true, census: 'fill' }
    },
    [ROLES.GOBIERNO]: {
        ia: { decision: 'full_analysis', can_report: 'view_all', emergency: 'manage_alerts' },
        health: { access: 'anonymized_stats' },
        governance: { dashboard: 'total', ia_register: 'total', impact: 'total' },
        market: { my_business: 'fiscalization' },
        democracy: { can_vote: 'monitor_results' },
        volunteering: { tasks: 'manage' },
        user: { profile: 'own_only', minors_support: 'level_2', census: 'analyze' }
    },
    [ROLES.ADMIN]: {
        ia: { decision: 'total', can_report: 'view_all', emergency: 'total' },
        health: { access: 'restricted_policy' },
        governance: { dashboard: 'total', ia_register: 'total', impact: 'total' },
        market: { general: 'total_management', my_business: 'moderation' },
        democracy: { configuration: 'full', history: 'total' },
        volunteering: { tasks: 'total' },
        user: { management: 'global', minors_support: 'total', census: 'total' }
    },
    [ROLES.MANTENIMIENTO]: {
        ia: { decision: 'logs_debug', can_report: 'restricted', emergency: 'technical_monitoring' },
        health: { access: 'none' },
        governance: { dashboard: 'monitoring', ia_register: 'total' },
        user: { profile: 'own_only' }
    }
};

module.exports = {
    ROLES,
    ROLE_PERMISSIONS
};
