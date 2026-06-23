export const corsOptions = {
    origin: (origin, callback) => {
        // Permitir peticiones sin origin (Postman, curl) y cualquier origen en desarrollo
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With', 
        'Accept',
        'x-token',
        'X-Token'
    ],
    exposedHeaders: ['x-token'],
    credentials: true 
};