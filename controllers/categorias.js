const { request, response } = require("express")

const { Categoria } = require("../models");



const obtenerCategorias = async( req = request, res = response ) => {

    const { pagina = 1, cantidad = 5 } = req.query

    let paginaNum = Number( pagina ) 
    if( paginaNum <= 0 ){
        paginaNum = 1
    }

    let cantidadNum = Number(cantidad)
    if( cantidadNum <= 0 ){
        cantidadNum = 5
    } 


    const desde = ( paginaNum - 1 ) * cantidadNum
    const limite = cantidadNum


    const query = { estado: true }

    try {
        
        const [categorias, total ] = await Promise.all([
            Categoria.find(query)
                .populate('usuario', 'nombre')
                .skip( Number( desde ) )
                .limit( Number(limite) ),
            Categoria.countDocuments(query)
        ]) 
    
    
        res.status(200).json({
            cantidad: categorias.length,
            total,
            pagina: paginaNum,
            totalDePaginas: Math.ceil(total / cantidadNum),
            categorias,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hubo un error al obtener las categorías. Consulte al administrador.'
        })
    }

}

const obtenerCategoria = async( req = request, res = response ) => {

    const { id } = req.params

    try {
        
        const categoria = await Categoria.findOne({ _id: id, estado:true })
            .populate('usuario', 'nombre')

        if( !categoria ){
            return res.status(400).json({msg: 'Categoria no encontrada'})
        }


        res.status(200).json( categoria )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hubo un error al obtener la categoría. Consulte al administrador.'
        })
    }

}



const crearCategoria = async( req = request, res = response ) => {

    const { nombre } = req.body

    const usuario = req.usuarioAutenticado
    
    try {
        const categoriaDB = await Categoria.findOne({ nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } })
        
        if( categoriaDB ){
            return res.status(400).json({
                msg: `La categoría ${ categoriaDB.nombre } ya existe`
            })
        }
        
        const data ={
            nombre,
            usuario: usuario._id
        }

        const categoria = await new Categoria(data)
        await categoria.save()
        

        res.status(201).json(categoria)

    } catch (error) {
        
        console.log(error)
        res.status(500).json({
            msg: 'Hubo un error al crear la categoría. Consulte al administrador.'
        })

    }

}



const actualizarCategoria = async( req = request, res = response ) => {

    const { id } = req.params
    const { nombre } = req.body

    const data = {
        nombre, 
        usuario: req.usuarioAutenticado._id
    }

    try {

        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })
            .populate('usuario', 'nombre')

        res.status(200).json({
            categoria
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hubo un error al actualizar la categoría. Consulte al administrador.'
        })
    }


}



const eliminarCategoria = async( req = request, res = response ) => {

    const { id } = req.params

    try {

        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })

        res.status(200).json(categoria)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hubo un error al eliminar la categoría. Consulte al administrador.'
        })
    }



}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}