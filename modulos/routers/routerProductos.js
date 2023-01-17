const { Router } = require('express')
const { getProductos, postProductos, getProducto, putProductos, deleteProducto } = require('../controllers/controllerProducto.js')
const { checkAuthentication } = require('../middleware/checkAuthentication.js')

// const { option } = require('../configKnex/config.js')

// const productos = new Produc(option.mysql, 'productos')

const router = Router()

router.get('/', checkAuthentication, getProductos)

router.post("/", checkAuthentication, postProductos)

router.get("/:id", checkAuthentication, getProducto)

router.put("/:id", checkAuthentication, putProductos)

router.delete("/:id", checkAuthentication, deleteProducto)

module.exports = router