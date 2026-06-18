# Kinal Break

Sistema web de pedidos anticipados para la cafetería de Fundación Kinal. Permite a los estudiantes pedir su comida en línea antes del receso, para reducir el tiempo de fila durante los 20 minutos de descanso.

## Tabla de contenidos

- [El problema](#el-problema)
- [La solución](#la-solución)
- [Arquitectura del sistema](#arquitectura-del-sistema)
- [Servicios del proyecto](#servicios-del-proyecto)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
  - [Opción A: con Docker (recomendado)](#opción-a-con-docker-recomendado)
  - [Opción B: manual, servicio por servicio](#opción-b-manual-servicio-por-servicio)
- [Variables de entorno](#variables-de-entorno)
- [Documentación de la API (Swagger)](#documentación-de-la-api-swagger)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Equipo](#equipo)

---

## El problema

Durante el receso escolar de 20 minutos, la cafetería de Kinal recibe a gran parte de la población estudiantil al mismo tiempo. Esto genera filas que pueden tardar entre 10 y 15 minutos, es decir, la mayor parte del receso se pierde esperando en fila en vez de descansar o comer con calma.

## La solución

Kinal Break es una aplicación web (con una experiencia adaptada para celular) donde el estudiante puede:

1. Ver el menú disponible en la cafetería.
2. Armar su pedido y agregarlo al carrito.
3. Confirmar el pedido antes de que empiece el receso.
4. Llegar a la cafetería solo a recoger y pagar en efectivo, sin hacer toda la fila.

**Importante:** Kinal Break no elimina la fila por completo, es un complemento. Reduce el tiempo que cada estudiante pasa esperando, al mover la parte de "decidir y pedir" fuera del momento de mayor saturación.

Del lado de la cafetería, el personal cuenta con un panel administrativo para gestionar el menú, ver los pedidos entrantes en tiempo real, actualizar su estado (pendiente, pagado, entregado, no pagado), y consultar reportes de ventas.

---

## Arquitectura del sistema

El proyecto sigue una arquitectura de **microservicios**, lo que permite que cada parte del sistema se desarrolle, escale y despliegue de forma independiente.

```
┌─────────────────┐       ┌──────────────────────┐
│   client-admin   │──────▶│     server-admin      │
│  (React + Vite)  │       │  (Node · Express)     │
│  Panel cafetería  │       │  Productos, Pagos,    │
└─────────────────┘       │  Reportes, Órdenes    │
        │                  └──────────┬───────────┘
        │                             │
        │                             ▼
        │                      ┌─────────────┐
        │                      │  MongoDB     │
        │                      └─────────────┘
        │
        ▼
┌──────────────────┐
│ pedidos-service   │──────────────────▲
│  (Node · Express) │                  │
│  Carrito, Pedidos │──────────────────┘
└──────────────────┘

┌──────────────────────┐       ┌─────────────┐
│   auth-service         │──────▶│ PostgreSQL   │
│  (.NET 8 · ASP.NET)   │       └─────────────┘
│  Registro, Login, JWT │
└──────────────────────┘
```

- **client-admin** y **pedidos-service** son consumidos por el estudiante (a través del frontend) y por el personal de cafetería (panel administrativo).
- **server-admin** centraliza la gestión del catálogo, pagos, transacciones y reportes.
- **auth-service** es independiente y maneja toda la autenticación y autorización del sistema mediante JWT, consumido por los demás servicios para validar tokens.

---

## Servicios del proyecto

| Servicio | Carpeta | Tecnología | Puerto |
|---|---|---|---|
| Autenticación | `authentication-service/` | .NET 8 + PostgreSQL | `5296` |
| Administración (productos, pagos, reportes, órdenes) | `server-admin/` | Node.js + Express + MongoDB | `3021` |
| Pedidos (carrito y confirmación del estudiante) | `client-admin/pedidos-service/` | Node.js + Express + MongoDB | `3010` |
| Panel administrativo (frontend) | `client-admin/` | React + Vite + Tailwind | `5173` (dev) / `80` (Docker) |
| Base de datos relacional | `postgre_db/` | PostgreSQL 13 | `5436` |
| Base de datos documental | — | MongoDB 7.0 | `27017` |

### Detalle por servicio

**`authentication-service`** — Gestiona registro de usuarios (solo correos institucionales `@kinal.edu.gt` o `@kinal.org.gt`), inicio de sesión, verificación de correo, recuperación de contraseña, y emisión de tokens JWT. Controla los roles del sistema (`USER_ROLE`, `ADMIN_ROLE`).

**`server-admin`** — Administra el catálogo de productos y acompañamientos (CRUD con imágenes vía Cloudinary), las órdenes vistas por cafetería, los pagos y transacciones (incluyendo el flujo de doble confirmación para marcar un pedido como "No pagado"), y genera reportes de ventas exportables a Excel y PDF.

**`pedidos-service`** (dentro de `client-admin`) — Maneja el carrito de compras y la confirmación de pedidos por parte del estudiante, su historial de pedidos, cancelaciones, y limpieza automática de pedidos expirados.

**`client-admin`** — Interfaz web del panel administrativo: login, registro, verificación de correo, y la base para los módulos de productos, pedidos, acompañamientos, pagos y reportes.

---

## Tecnologías utilizadas

**Backend**
- Node.js 20 + Express 5
- ASP.NET Core 8.0 (Entity Framework Core, JWT Bearer Authentication, BCrypt)
- MongoDB 7.0 + Mongoose
- PostgreSQL 13

**Frontend**
- React 19 + Vite
- Tailwind CSS 4
- Zustand (manejo de estado)
- React Router, React Hook Form

**Infraestructura y herramientas**
- Docker + Docker Compose
- pnpm (gestor de paquetes estandarizado en los 3 servicios Node)
- Swagger / OpenAPI (documentación de API)
- Cloudinary (almacenamiento de imágenes)

---

## Requisitos previos

Para ejecutar el proyecto con Docker (recomendado) solo necesitas:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo.

Para ejecutar el proyecto manualmente, sin Docker, necesitas además:

- [Node.js 20 LTS](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)
- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
- MongoDB corriendo localmente o en [MongoDB Atlas](https://www.mongodb.com/atlas)
- PostgreSQL corriendo localmente

---

## Instalación y ejecución

### Opción A: con Docker (recomendado)

Esta es la forma más simple: un solo comando levanta los 7 contenedores (2 bases de datos + 5 servicios).

1. Clona el repositorio y entra a la carpeta raíz.
2. Crea los archivos de variables de entorno reales a partir de las plantillas (ver sección [Variables de entorno](#variables-de-entorno)).
3. Desde la raíz del proyecto, ejecuta:

```bash
docker compose up --build
```

4. Una vez que todos los contenedores estén corriendo:
   - Panel administrativo: `http://localhost:5173`
   - API de administración: `http://localhost:3021/KinalBreak/v1`
   - API de pedidos: `http://localhost:3010/api/pedidos`
   - API de autenticación: `http://localhost:5296/api/v1`

5. Para detener todo:

```bash
docker compose down
```

> **Nota:** la primera ejecución descarga las imágenes base y construye cada servicio, por lo que puede tardar varios minutos. Las siguientes ejecuciones son más rápidas gracias a la caché de Docker.

### Opción B: manual, servicio por servicio

Si prefieres no usar Docker, cada servicio se levanta por separado.

**1. Auth Service (.NET)**

```bash
cd authentication-service/auth-service
dotnet restore
dotnet run --project src/AuthService.Api
```

**2. Server Admin (Node)**

```bash
cd server-admin
pnpm install
pnpm dev
```

**3. Pedidos Service (Node)**

```bash
cd client-admin/pedidos-service
pnpm install
node index.js
```

**4. Client Admin (React)**

```bash
cd client-admin
pnpm install
pnpm dev
```

Asegúrate de tener MongoDB y PostgreSQL corriendo antes de iniciar los servicios que dependen de ellos.

---

## Variables de entorno

Por seguridad, los archivos `.env` y `appsettings.json` con credenciales reales **no están incluidos en el repositorio**. En su lugar, cada servicio tiene un archivo de plantilla:

| Servicio | Plantilla | Archivo real a crear |
|---|---|---|
| `server-admin` | `.env.example` | `.env` |
| `client-admin/pedidos-service` | `.env.example` | `.env` |
| `client-admin` | `.env.example` | `.env` |
| `authentication-service/auth-service/src/AuthService.Api` | `appsettings.Example.json` | `appsettings.json` |

Para configurar cada servicio:

```bash
cp .env.example .env
```

(o, en `authentication-service`, `cp appsettings.Example.json appsettings.json`)

Luego completa los valores reales (credenciales de Cloudinary, JWT secret, credenciales de SMTP, etc.). Estos valores deben solicitarse a algún integrante del equipo por un canal seguro (no por Git).

> El `JWT_SECRET` debe ser idéntico en `server-admin`, `pedidos-service`, y `authentication-service`, ya que los tokens emitidos por el servicio de autenticación deben poder validarse en los demás servicios.

---

## Documentación de la API (Swagger)

Una vez levantados los servicios, la documentación interactiva está disponible en:

- **Auth Service:** `http://localhost:5296/swagger`
- **Server Admin** (incluye también las rutas de `pedidos-service`): `http://localhost:3021/KinalBreak/v1/docs`

---

## Estructura del repositorio

```
Kinal-Break/
├── authentication-service/      # Servicio de autenticación (.NET 8)
│   └── auth-service/
│       └── src/
│           ├── AuthService.Api/
│           ├── AuthService.Application/
│           ├── AuthService.Domain/
│           └── AuthService.Persistence/
├── client-admin/                # Frontend (React) + servicio de pedidos
│   ├── pedidos-service/         # Servicio de pedidos (Node)
│   └── src/
├── server-admin/                # Servicio de administración (Node)
│   └── src/
│       ├── Products/
│       ├── Order/
│       ├── Payment/
│       ├── Accompaniment/
│       ├── Reporte/
│       └── transaction/
├── postgre_db/                  # Configuración de PostgreSQL para desarrollo
├── docker-compose.yml           # Orquestación de todos los servicios
└── README.md
```

---

## Equipo

Proyecto desarrollado para el curso de Taller de Aplicaciones, Fundación Kinal — Ingeniería en Ciencias de la Computación y Tecnologías de la Información.

| Integrante | Rol |
|---|---|
| Kenet Efrain Kuyuch Joj | Product Owner / Developer (Auth Service) |
| Rigoberto Godinez Fajardo | Scrum Master / Developer (Pedidos Service) |
| Carlos Emilio Navarro Sifontes | Developer (Gestión de Menú, Frontend) |
| Carlos Alejandro Patal Choc | Developer (Estados, Notificaciones, Dashboard) |
| Carlos López Quino | Developer (Pagos, Reportes, API Gateway) |
