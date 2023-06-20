

const dbValidator  = require('./db-validators')
const googleVerify = require('./google-verify')
const jwt          = require('./jwt')
const subirArchivo = require('./subir-archivo')


module.exports = {
    ...dbValidator,
    ...googleVerify,
    ...jwt,
    ...subirArchivo,
}