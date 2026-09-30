# Aplicación de servicios

Base backend para una aplicación de servicios con Node.js y Express. No utiliza base de datos: las opciones de servicio se mantienen en memoria para esta primera versión.

## Requisitos

- Node.js 18 o posterior

## Instalación

Desde esta carpeta ejecuta:

```bash
npm install
```

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

El servidor queda disponible en `http://localhost:3000`. Para desarrollo, con reinicio automático:

```bash
npm run dev
```

La carpeta `public` contiene `index.html`, `estilos.css` y `app.js`. Estos archivos se sirven como contenido estático y el cliente consume la API mediante `fetch`.

## API

### `GET /api/servicios`

Devuelve un arreglo JSON con los servicios disponibles. Cada elemento incluye `id`, `nombre` y `descripcion`.

### `POST /api/solicitudes`

Recibe un objeto JSON con todos estos campos obligatorios:

```json
{
  "nombre": "Ana Pérez",
  "correo": "ana@example.com",
  "servicio": "Diseño web",
  "comentario": "Me gustaría recibir información."
}
```

Devuelve `201` con una confirmación cuando los datos son válidos y `400` con detalles de validación cuando falta un campo, el correo no tiene un formato razonable o el servicio no pertenece al catálogo disponible.