/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Microservicio externo (.NET) para la gestión de usuarios, verificación y acceso.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una cuenta nueva en el sistema. Requiere envío de datos como form-data para procesar la imagen de perfil.
 *     tags: [Autenticación]
 *     servers:
 *       - url: http://localhost:5296/api/v1
 *         description: Servidor de Autenticación (.NET)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "Rigoberto"
 *               Surname:
 *                 type: string
 *                 example: "Godinez"
 *               Username:
 *                 type: string
 *                 example: "rgodinez"
 *               Email:
 *                 type: string
 *                 example: "rigo.fajardo67@gmail.com"
 *               Password:
 *                 type: string
 *                 example: "Pass1234"
 *               Phone:
 *                 type: string
 *                 example: "12345678"
 *               ProfilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil del usuario (.jpg, .png)
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente.
 *       400:
 *         description: Error en la validación de los datos enviados.
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verificar cuenta de usuario
 *     description: Verifica y activa la cuenta de un usuario utilizando el Token enviado.
 *     tags: [Autenticación]
 *     servers:
 *       - url: http://localhost:5296/api/v1
 *         description: Servidor de Autenticación (.NET)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Token:
 *                 type: string
 *                 example: "ZTYcROWE8WTajYABtT5aiyrqQZ0irsnxpr2TCo_BqIE"
 *     responses:
 *       200:
 *         description: Cuenta verificada exitosamente.
 *       400:
 *         description: Token inválido o cuenta ya verificada.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión (Login)
 *     description: Autentica a un usuario y devuelve un token de acceso.
 *     tags: [Autenticación]
 *     servers:
 *       - url: http://localhost:5296/api/v1
 *         description: Servidor de Autenticación (.NET)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               EmailOrUsername:
 *                 type: string
 *                 example: "godinezrigoberto70@gmail.com"
 *               Password:
 *                 type: string
 *                 example: "Pass1234"
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token JWT.
 *       401:
 *         description: Credenciales incorrectas.
 */