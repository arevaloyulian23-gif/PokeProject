const express = require('express');
const router = express.Router();
const db = require('../db'); // Ajusta la ruta a tu conexión DB si es necesario

// GET - Obtener todos los productos
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM productos';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// POST - Crear nuevo producto
router.post('/', (req, res) => {
  const { nomProducto, cantidad, precio } = req.body;
  const sql = 'INSERT INTO productos (nomProducto, cantidad, precio) VALUES (?, ?, ?)';
  
  db.query(sql, [nomProducto, cantidad, precio], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id_producto: result.insertId, nomProducto, cantidad, precio });
  });
});

// PUT - Actualizar producto
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nomProducto, cantidad, precio } = req.body;
  const sql = 'UPDATE productos SET nomProducto = ?, cantidad = ?, precio = ? WHERE id_producto = ?';

  db.query(sql, [nomProducto, cantidad, precio, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado correctamente' });
  });
});

// DELETE - Eliminar producto
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM productos WHERE id_producto = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      // Manejo de error si el producto está en detalle_venta (Foreign Key)
      if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
        return res.status(400).json({ 
          message: 'No se puede eliminar el producto porque está asociado a una venta realizada.' 
        });
      }
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  });
});

module.exports = router;