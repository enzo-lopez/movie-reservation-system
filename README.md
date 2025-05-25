# Movie Reservation System 🎬

**Frontend en producción:**  
[https://movie-reservation-enzo-lopez.vercel.app/](https://movie-reservation-enzo-lopez.vercel.app/)

**Backend en producción:**  
[https://movie-reservation-fullstack-production.up.railway.app/](https://movie-reservation-fullstack-production.up.railway.app/)

---

Este proyecto es una implementación completa del sistema de reservas de entradas
de cine propuesto en el roadmap de backend de
[roadmap.sh](https://roadmap.sh/projects/movie-reservation-system). Incluye
backend con **Node.js/Express**, base de datos **MongoDB** y frontend en
**Next.js**.

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Autores](#autores)
- [Créditos](#créditos)

---

## Descripción

Este sistema permite a los usuarios registrarse, iniciar sesión, buscar
películas, reservar asientos y gestionar reservas. Los administradores pueden
gestionar películas, salas y ver todas las reservas.  
El proyecto sigue los lineamientos del
[Movie Reservation System de roadmap.sh](https://roadmap.sh/projects/movie-reservation-system).

---

## Características

- Registro e inicio de sesión de usuarios
- Roles de usuario (usuario, administrador)
- Gestión de películas, salas y reservas
- Panel de administración
- Selección visual de asientos
- Validación y autenticación JWT
- Responsive design

---

## Tecnologías

- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** Node.js, Express.js, Zod, JWT
- **Base de datos:** MongoDB (Atlas)
- **Despliegue:** Vercel (frontend), Railway (backend)

---

## Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/enzo-lopez/movie-reservation-system.git
cd movie-reservation-system
```

### 2. Instala las dependencias

**En la raíz del proyecto**
```bash
npm install
```

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd ../frontend
npm install
```

---

## 3. Variables de entorno

Copia el archivo `.env.example` a `.env` en ambas carpetas, `frontend` y
`backend`, y configura las variables de entorno necesarias.

---

## Estructura del proyecto

```bash
movie-reservation
├── backend
│   ├── src
│   ├── .env.example
│   └── package.json
└── frontend
    ├── src
    ├── .env.example
    └── package.json
```

---

## Uso

1. Inicia el servidor de desarrollo

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd frontend
npm run dev
```

**Levanta tanto el Frontend como el Backend**
```bash
npm start
```
```markdown
### 2. Instala las dependencias

**En la raíz del proyecto**

```bash
npm install
```

Esto instalará las dependencias necesarias para los scripts y herramientas generales del proyecto.

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd ../frontend
npm install
```

---

## Uso

1. Inicia la aplicación desde la **raíz del proyecto**:

```bash
npm start
```

Esto levantará tanto el backend como el frontend en modo desarrollo (usando el script definido en el `package.json` de la raíz).

2. Abre tu navegador y visita `http://localhost:3000` para el frontend y  
   `http://localhost:3001` para el backend (o el puerto que corresponda según tu configuración de los archivos .env).


## API Endpoints

Usuarios

- `POST /user/register`: Registrar un nuevo usuario
- `POST /user/login`: Iniciar sesión
- `POST /user/all`: Listar usuarios (admin)

Peliculas

- `GET /movie`: Obtener lista de películas
- `POST /movie`: Crear pelicula

Salas de cine

- `GET /cinema-room`: Obtener sala por filtro
- `GET /cinema-room/all`: Listar todas las salas (admin)
- `POST /cinema-room/`: Crear/actualizar sala (admin)

Reservas

- `POST /reservation/`: Crear reserva
- `GET /reservation/all`: Listar reservas (admin)
- `GET /reservation/user`: Listar reservas del usuario

Consulta el archivo `backend/src/routes` para ver todas las rutas disponibles.

---

## Capturas de pantalla

---

## Autores

- [Enzo Lopez](https://github.com/enzo-lopez)

---

## Créditos

- [roadmap.sh](https://roadmap.sh/projects/movie-reservation-system) - Para el
  diseño del sistema
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Base de datos en la
  nube
- [Vercel](https://vercel.com/) - Despliegue del frontend
- [Railway](https://railway.app/) - Despliegue del backend
