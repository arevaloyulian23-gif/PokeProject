var express = require('express');
var router = express.Router();
var db = require('../db'); // Tu conexión a MySQL

// 1. OBTENER TODOS LOS CLIENTES (GET)
router.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. CREAR CLIENTE (POST)
router.post('/', (req, res) => {
  const { nomCliente, contacto, departamento, ciudad } = req.body;
  const sql = 'INSERT INTO clientes (nomCliente, contacto, departamento, ciudad) VALUES (?, ?, ?, ?)';

  db.query(sql, [nomCliente, contacto, departamento, ciudad], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id_cliente: result.insertId, nomCliente, contacto, departamento, ciudad });
  });
});

// 3. ACTUALIZAR CLIENTE (PUT)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nomCliente, contacto, departamento, ciudad } = req.body;
  const sql = 'UPDATE clientes SET nomCliente = ?, contacto = ?, departamento = ?, ciudad = ? WHERE id_cliente = ?';

  db.query(sql, [nomCliente, contacto, departamento, ciudad, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente actualizado correctamente' });
  });
});

// 4. ELIMINAR CLIENTE (DELETE)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM clientes WHERE id_cliente = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      // Manejo de restricción por llave foránea (si el cliente tiene ventas vinculadas)
      if (err.errno === 1451) {
        return res.status(400).json({ 
          error: 'No se puede eliminar el cliente porque tiene registros de ventas asociados.' 
        });
      }
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado correctamente' });
  });
});

module.exports = router;