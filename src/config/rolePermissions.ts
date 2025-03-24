// config/rolePermissions.js

export const roleRoutes = {
    admin: ["/", "/services/*", "/bookings/*", "/captains/*", "/customers/*", "/unauthorized"],
    manager: ["/", "/services/*", "/bookings/*", "/captains/*", "/customers/*", "/unauthorized"],
    captain: ["/pos/*", "/table", "/unauthorized"],
};

// Utility function to check if a route is accessible for a role
export const hasAccess = (role: keyof typeof roleRoutes, path: string) => {
    const allowedRoutes = roleRoutes[role] || [];

    // Exact match
    if (allowedRoutes.includes(path)) {
        return true;
    }

    // Wildcard match: Check if any route matches the path pattern
    return allowedRoutes.some((route) => {
        if (route.endsWith("/*")) {
            const baseRoute = route.slice(0, -2); // Remove the "/*" part
            return path.startsWith(baseRoute);
        }
        return false;
    });
};