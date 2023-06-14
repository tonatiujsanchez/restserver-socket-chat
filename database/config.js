const mongoose = require('mongoose')


const dbConnection = async() => {
    try {
        
        await mongoose.connect(process.env.MONGO_CNN)
        console.log('Base de Datos online')

    } catch (error) {
        console.log(error)
        throw new Error('Error al inicial la DB')
    }
}


module.exports = {
    dbConnection
}