const { productos } = require("../class/productos")

const getProductos = async (req, res) => {
    produc = await productos.getAll()
    res.cookie('time', '1min', { maxAge: 60000 }).render('lista', {
        productsExist: produc.length,
        products: produc
    })
}

const postProductos = async (req, res) => {
    try {
        const { nombre, precio } = req.body
        await productos.save({ nombre: nombre, precio: precio })
        res.cookie('time', '1min', { maxAge: 60000 }).status(201).redirect('./')
    }
    catch (error) { res.cookie('time', '1min', { maxAge: 60000 }).status(400).send({ msg: "Error al cargar el producto", err: error }) }
}

const getProducto = async (req, res) => {
    const { id } = req.params
    res.cookie('time', '1min', { maxAge: 60000 }).render('producto', {
        productsExist: await productos.getById(parseInt(id)),
        products: await productos.getById(parseInt(id))
    })
}

const putProductos = async (req, res) => {
    const { id } = req.params
    const guardado = { title: req.body.title, price: req.body.price, thumbnail: req.body.thumbnail, id: parseInt(id) }
    await productos.actualizar(guardado)
}

const deleteProducto = async (req, res) => {
    const { id } = req.params
    await productos.deleteById(parseInt(id))
}

module.exports = {
    getProductos,
    getProducto,
    postProductos,
    putProductos,
    deleteProducto
}