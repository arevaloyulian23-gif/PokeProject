const express = require('express');
const cors = require('cors'); // Para permitir peticiones desde React
const app = express();
const port = 3000;


// Middlewares
app.use(cors());
app.use(express.json()); // Permite a Express leer el JSON que envía el frontend

// Importar archivos de rutas
const clientesRouter = require('../routes/clientes');
const productosRouter = require('../routes/productos');
const proveedoresRouter = require('../routes/proveedores');
const ventasRouter = require('../routes/ventas');
const detalleVentaRouter = require('../routes/detalle_venta');
const usersRouter = require('../routes/users');

// Montar las rutas
app.use('/clientes', clientesRouter);
app.use('/productos', productosRouter);
app.use('/proveedores', proveedoresRouter);
app.use('/ventas', ventasRouter);
app.use('/detalle_venta', detalleVentaRouter);
app.use('/users', usersRouter);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('Servidor corriendo correctamente');
});

// Manejador de rutas no encontradas (debe ir SIEMPRE al final)
app.use((req, res) => {
  res.status(404).json({ message: 'La ruta a la que intentas acceder no existe' });
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});