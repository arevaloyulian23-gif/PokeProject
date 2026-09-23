var express = require('express');
var router = express.Router();

const proveedores = [];
router.get('/', (req, res) =>{
    res.send(proveedores);
});
module.exports = router;