var express = require('express');
var router = express.Router();

const Usuarios = [
  {
    id: 1,
    nombre: "Malcon",
    pass: "123456"
  },
  {
    id: 2,
    nombre: "Juan",
    pass: "654321"
  }
];

router.get('/', function(req, res) {
  res.json(Usuarios);
});

router.post('/', function(req, res) {
  const { nombre, pass } = req.body;

  if (!nombre || !pass) {
    return res.status(400).json({
      mensaje: "Debes ingresar nombre y contraseña."
    });
  }

  const usuarioEncontrado = Usuarios.find(
    (u) => u.nombre.toLowerCase() === nombre.toLowerCase() && u.pass === pass
  );

  if (usuarioEncontrado) {
    return res.status(200).json({
      exito: true,
      mensaje: `¡Bienvenido, ${usuarioEncontrado.nombre}! Acceso concedido.`,
      usuario: { id: usuarioEncontrado.id, nombre: usuarioEncontrado.nombre }
    });
  }

  return res.status(401).json({
    exito: false,
    mensaje: "Usuario o contraseña incorrectos."
  });
});

module.exports = router;