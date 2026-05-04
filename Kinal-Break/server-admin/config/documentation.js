import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kinal Break API',
            version: '1.0.0',
            description: 'Documentación oficial de los servicios de la cafetería Kinal Break. Incluye gestión de pagos, transacciones, órdenes, reportes y el microservicio de pedidos.',
            contact: {
                name: 'Ice Team' 
            }
        },
        servers: [
            {
                url: 'http://localhost:3021/KinalBreak/v1',
                description: 'Servidor Local de Desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        `${process.cwd()}/src/Payment/*.js`,
        `${process.cwd()}/src/transaction/*.js`,
        `${process.cwd()}/src/Order/*.js`,
        `${process.cwd()}/src/Reporte/*.js`,
        `${process.cwd()}/src/Products/*.js`,
        `${process.cwd()}/../pedidos-service/routes/*.js`,
        `${process.cwd()}/src/**/*.js`
    ]
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
export { swaggerUi };