const { request, response } = require("express");
const { Producto } = require("../models");



const obtenerProductos = async( req = request, res = response) => {

    const { pagina = 1, cantidad = 5 } = req.query

    let paginaNum = Number( pagina )
    let cantidadNum = Number( cantidad )

    if( paginaNum <= 0 ){
        paginaNum = 1
    }

    if( cantidadNum <= 0 ){
        cantidadNum = 5
    }

    const desde = ( paginaNum - 1 ) * cantidadNum
    const limite = cantidadNum

    const query = { estado: true }

    try {
        
        const [ productos, total ] = await Promise.all([
            Producto.find(query)
                .populate('categoria', 'nombre')
                .populate('usuario', 'nombre')
                .skip( desde )
                .limit( limite ),
            Producto.countDocuments(query)
        ])   


        res.status(200).json({
            cantidad: productos.length,
            total,
            pagina: paginaNum,
            totalDePaginas: Math.ceil( total / cantidadNum ),
            productos
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hubo un error al obtener los productos. Consulte al administrador.'
        })
    }


}


const obtenerProducto = async( req = request, res = response) => {
    
    const { id } = req.params

    try {

        const producto = await Producto.findOne({ _id: id, estado:true })
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')

        if( !producto ){
            return res.status(400).json({ msg: 'Producto no encontrado' })
        }

        res.status(200).json( producto )
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hubo un error al obtener el producto. Consulte al administrador.'
        })
    }


}

const crearProducto = async( req = request, res = response) => {

    const { nombre, precio, categoria, descripcion, disponible } = req.body
    const usuario = req.usuarioAutenticado

    try {
        
        const data = {
            nombre, 
            precio: Number(precio), 
            categoria, 
            descripcion, 
            disponible,
            usuario: usuario._id
        }
    
        const productoDB = await Producto.findOne({ 
            nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } 
        })

        if( productoDB ){
            return res.status(400).json({
                msg: `El producto ${ productoDB.nombre } ya existe`
            })
        }

        const producto = await new Producto( data )
        await producto.save()
    
    
        res.status(200).json( producto )
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hubo un error al crear el producto. Consulte al administrador.'
        })
    }

}


const actualizarProducto = async( req = request, res = response) => {

    const { id } = req.params
    const { nombre, precio, categoria, descripcion, disponible } = req.body
    const usuario = req.usuarioAutenticado


    const data = {
        nombre,
        precio,
        categoria,
        descripcion,
        disponible,
        usuario: usuario._id
    }

    try {

        const producto = await Producto.findByIdAndUpdate( id, data, { new: true } )
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
           
        res.status(200).json( producto )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hubo un error al editar el producto. Consulte al administrador.'
        })
    }
}

const eliminarProducto = async( req = request, res = response) => {

    const { id } = req.params

    try {

        const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })

        res.status(200).json( producto )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hubo un error al eliminar el producto. Consulte al administrador.'
        })
    }

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
}