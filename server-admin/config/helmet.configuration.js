export const helmetOptions = {
    contentSecurityPolicy:{
        useDefaults: true,
        directives:{
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com', 'https://images.unsplash.com'],
            connectSrc: ["'self'", "http://localhost:3021", "http://localhost:5296", "https://res.cloudinary.com"],
            fontSrc:["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            frameAncestors: ["'none'"]
        }
    },
    hsts: false,
    frameguard:{action: 'deny'},
    hidePoweredBy: true,
    crossOriginResourcePolicy: {policy: 'cross-origin'},
    crossOriginEmbedderPolicy: false,
};