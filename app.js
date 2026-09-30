const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const servicios = [
  {
    id: 1,
    nombre: 'Diseño web',
    descripcion: 'Diseño de sitios web modernos y adaptados a dispositivos móviles.'
  },
  {
    id: 2,
    nombre: 'Desarrollo de aplicaciones',
    descripcion: 'Construcción de aplicaciones web funcionales para las necesidades de tu negocio.'
  },
  {
    id: 3,
    nombre: 'Soporte técnico',
    descripcion: 'Asistencia y mantenimiento para mantener tus servicios digitales disponibles.'
  }
];

app.get('/api/servicios', (req, res) => {
  res.json(servicios);
});

app.post('/api/solicitudes', (req, res) => {
  const { nombre, correo, servicio, comentario } = req.body || {};
  const camposObligatorios = { nombre, correo, servicio, comentario };
  const faltantes = Object.entries(camposObligatorios)
    .filter(([, valor]) => typeof valor !== 'string' || valor.trim() === '')
    .map(([campo]) => campo);
  const correoValido = typeof correo === 'string'
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
  const servicioValido = typeof servicio === 'string'
    && servicios.some(({ nombre }) => nombre === servicio.trim());

  if (faltantes.length > 0 || !correoValido || !servicioValido) {
    return res.status(400).json({
      error: 'Los datos enviados no son válidos.',
      detalles: {
        camposFaltantes: faltantes,
        correoValido,
        servicioValido
      }
    });
  }

  return res.status(201).json({
    mensaje: 'Solicitud recibida correctamente.',
    solicitud: {
      nombre: nombre.trim(),
      correo: correo.trim(),
      servicio: servicio.trim(),
      comentario: comentario.trim()
    }
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser JSON válido.' });
  }

  return next(err);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
}

module.exports = app;