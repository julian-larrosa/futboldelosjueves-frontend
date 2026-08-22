# FDLJ — Fútbol De Los Jueves (Frontend)

Frontend oficial de la liga FDLJ: estadísticas, rankings, perfil de jugadores,
gestión de partidos y convocatorias.

Stack: **React 19 + TypeScript + Vite + Tailwind CSS v4**.

## Requisitos

- Node.js 20+ (o [Bun](https://bun.sh))
- Backend FDLJ corriendo (por defecto en `http://localhost:8080`)

## Puesta en marcha

1. Instalar dependencias:

   ```bash
   bun install    # o: npm install
   ```

2. (Opcional) Configurar la URL del backend:

   ```bash
   cp .env.example .env.local
   # editar VITE_API_BASE_URL si el backend no está en localhost:8080
   ```

3. Levantar en desarrollo:

   ```bash
   bun run dev    # o: npm run dev
   ```

   La app queda en `http://localhost:3000`.

## Scripts

| Script | Descripción |
|---|---|
| `dev` | Servidor de desarrollo (puerto 3000) |
| `build` | Build de producción en `dist/` |
| `preview` | Sirve el build de producción localmente |
| `lint` | Chequeo de tipos con TypeScript (`tsc --noEmit`) |

## Funcionalidades principales

- **Autenticación**: login/registro de jugadores, registro de hinchas,
  recuperación de contraseña y cambio forzado cuando un admin la restablece.
- **Roles**: `ADMIN` gestiona partidos, convocatorias, atributos y resultados;
  los jugadores consultan y califican entre sí; los hinchas acceden en modo solo lectura.
- **Partidos**: creación/edición por admin, convocatoria gestionada por el admin,
  equipos, goles y calificaciones oficiales.
- **Perfil**: atributos, evolución de rating y cambio voluntario de contraseña.

## Estructura

```
src/
  api/        # Cliente HTTP tipado + APIs del backend
  auth/       # Contexto de autenticación y sesión persistente
  components/ # Vistas, modales y navegación
  hooks/      # useApi, usePaginatedApi, etc.
  utils/      # Formato y helpers de charts
```
