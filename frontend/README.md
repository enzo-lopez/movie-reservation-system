# Cinema Ticket Booking

Aplicación de reserva de entradas de cine desarrollada con Next.js y React.

## Integración de API - Guía Rápida

Este documento indica los archivos específicos donde se deben implementar las llamadas a la API.

### Películas

**Listado de películas**
- **Archivo**: `app/page.tsx`
- **Ubicación**: Reemplazar el array `movies` por una llamada a la API
- **Endpoint sugerido**: `GET /api/movies`

**Detalles de película**
- **Archivo**: `app/movie/[id]/page.tsx`
- **Ubicación**: Reemplazar el objeto `movieDetails` por una llamada a la API
- **Endpoint sugerido**: `GET /api/movies/{id}`

### Reservas

**Creación de reservas**
- **Archivo**: `app/booking/[movieId]/page.tsx`
- **Ubicación**: Función `handleBooking()`
- **Endpoint actual**: `POST /api/reservations`

**Listado de reservas del usuario**
- **Archivo**: `app/reservations/page.tsx`
- **Ubicación**: Reemplazar el array `mockReservations` por una llamada a la API
- **Endpoint sugerido**: `GET /api/users/{userId}/reservations`

### Autenticación

**Login**
- **Archivo**: `app/login/page.tsx`
- **Ubicación**: Función `handleSubmit()`
- **Endpoint sugerido**: `POST /api/auth/login`

**Registro**
- **Archivo**: `app/register/page.tsx`
- **Ubicación**: Función `handleSubmit()`
- **Endpoint sugerido**: `POST /api/auth/register`

### Administración

**Gestión de usuarios**
- **Archivo**: `app/admin/users/page.tsx`
- **Ubicación**: Reemplazar el array `initialUsers` y las funciones CRUD
- **Endpoints sugeridos**:
  - Listar: `GET /api/users`
  - Crear: `POST /api/users`
  - Actualizar: `PUT /api/users/{id}`
  - Eliminar: `DELETE /api/users/{id}`

**Gestión de películas**
- **Archivo**: `app/admin/movies/page.tsx`
- **Ubicación**: Reemplazar el array `initialMovies` y las funciones CRUD
- **Endpoints sugeridos**:
  - Listar: `GET /api/movies`
  - Crear: `POST /api/movies`
  - Actualizar: `PUT /api/movies/{id}`
  - Eliminar: `DELETE /api/movies/{id}`

**Gestión de salas de cine**
- **Archivo**: `app/admin/cinema-rooms/page.tsx`
- **Ubicación**: Reemplazar el array `initialRooms` y las funciones CRUD
- **Endpoints sugeridos**:
  - Listar: `GET /api/cinema-rooms`
  - Crear: `POST /api/cinema-rooms`
  - Actualizar: `PUT /api/cinema-rooms/{id}`
  - Eliminar: `DELETE /api/cinema-rooms/{id}`

**Gestión de reservas**
- **Archivo**: `app/admin/reservations/page.tsx`
- **Ubicación**: Reemplazar el array `initialReservations` y las funciones CRUD
- **Endpoints sugeridos**:
  - Listar: `GET /api/reservations`
  - Actualizar: `PUT /api/reservations/{id}` (solo fecha y hora)
  - Eliminar: `DELETE /api/reservations/{id}`

## Endpoints API Necesarios

Para completar la aplicación, se deben implementar los siguientes endpoints:

- `GET /api/movies`
- `GET /api/movies/{id}`
- `POST /api/movies`
- `PUT /api/movies/{id}`
- `DELETE /api/movies/{id}`

- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `GET /api/users/{id}/reservations`

- `GET /api/cinema-rooms`
- `GET /api/cinema-rooms/{id}`
- `POST /api/cinema-rooms`
- `PUT /api/cinema-rooms/{id}`
- `DELETE /api/cinema-rooms/{id}`

- `GET /api/reservations`
- `POST /api/reservations`
- `PUT /api/reservations/{id}`
- `DELETE /api/reservations/{id}`

- `POST /api/auth/login`
- `POST /api/auth/register`

## Ejecución del Proyecto

\`\`\`bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
