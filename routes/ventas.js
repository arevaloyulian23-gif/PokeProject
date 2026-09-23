const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión en la raíz

// GET - Obtener todas las ventas con el nombre del cliente (INNER JOIN)
router.get('/', (req, res) => {
  const sql = `
    SELECT v.id_venta, v.id_cliente, c.nomCliente, v.fecha_venta, v.total, v.estado 
    FROM ventas v
    INNER JOIN clientes c ON v.id_cliente = c.id_cliente
    ORDER BY v.id_venta DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al consultar las ventas' });
    res.json(result);
  });
});

// POST - Registrar nueva venta
router.post('/', (req, res) => {
  const { id_cliente, total, estado } = req.body;
  const sql = 'INSERT INTO ventas (id_cliente, total, estado) VALUES (?, ?, ?)';

  db.query(sql, [id_cliente, total, estado || 'Completada'], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al registrar la venta' });
    res.json({ id_venta: result.insertId, message: 'Venta registrada con éxito' });
  });
});

// PUT - Actualizar venta
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { id_cliente, total, estado } = req.body;
  const sql = 'UPDATE ventas SET id_cliente = ?, total = ?, estado = ? WHERE id_venta = ?';

  db.query(sql, [id_cliente, total, estado, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al actualizar la venta' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json({ message: 'Venta actualizada correctamente' });
  });
});

// DELETE - Eliminar venta
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM ventas WHERE id_venta = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      // Si la venta tiene detalles en la tabla detalle_venta (Foreign Key)
      if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
        return res.status(400).json({ 
          message: 'No se puede eliminar la venta porque contiene productos en detalle_venta.' 
        });
      }
      return res.status(500).json({ message: 'Error al intentar eliminar la venta' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    res.json({ message: 'Venta eliminada correctamente' });
  });
});

module.exports = router;