const { response, request } = require('express')


const getUsuarios = ( req = request, res = response ) => {

    const { q, nombre, edad, apikey } = req.query

    res.json({
        msg: 'Hello world controller - GET API',
        query:{
            q, nombre, apikey
        }
    })
}

const putUsuarios = ( req, res = response ) => {

    const { nombre, edad } = req.body
    const { id } = req.params

    res.json({
        msg: 'Hello world controller - PUT API',
        data: {
            nombre,
            edad
        },
        id
    })
}

const postUsuarios = ( req, res = response ) => {

    res.json({
        msg: 'Hello world controller - POST API',
    })
}



const patchUsuarios = ( req, res = response ) => {
    res.json({
        msg: 'Hello world controller - PATCH API'
    })
}

const deleteUsuarios = ( req, res = response ) => {
    res.json({
        msg: 'Hello world controller - DELETE API'
    })
}


module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    patchUsuarios,
    deleteUsuarios
}
