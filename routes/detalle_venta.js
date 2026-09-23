const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Obtener todos los detalles con el nombre del producto
router.get('/', (req, res) => {
  const sql = `
    SELECT d.id_detalle, d.id_venta, d.id_producto, p.nomProducto, d.cantidad, d.precio_unitario, d.subtotal
    FROM detalle_venta d
    INNER JOIN productos p ON d.id_producto = p.id_producto
    ORDER BY d.id_detalle DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al consultar los detalles de ventas' });
    res.json(result);
  });
});

// POST - Crear detalle
router.post('/', (req, res) => {
  const { id_venta, id_producto, cantidad, precio_unitario, subtotal } = req.body;
  const sql = 'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [id_venta, id_producto, cantidad, precio_unitario, subtotal || (cantidad * precio_unitario)], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al registrar el detalle de venta' });
    res.json({ id_detalle: result.insertId, message: 'Detalle de venta registrado con éxito' });
  });
});

// PUT - Actualizar detalle
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { id_venta, id_producto, cantidad, precio_unitario, subtotal } = req.body;
  const sql = 'UPDATE detalle_venta SET id_venta = ?, id_producto = ?, cantidad = ?, precio_unitario = ?, subtotal = ? WHERE id_detalle = ?';

  db.query(sql, [id_venta, id_producto, cantidad, precio_unitario, subtotal || (cantidad * precio_unitario), id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al actualizar el detalle' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }
    res.json({ message: 'Detalle de venta actualizado correctamente' });
  });
});

// DELETE - Eliminar detalle
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM detalle_venta WHERE id_detalle = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al eliminar el detalle' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }
    res.json({ message: 'Detalle eliminado con éxito' });
  });
});

module.exports = router;