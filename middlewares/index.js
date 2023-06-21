
const validarCampos = require('./validar-campos')
const validarJwt = require('./validar-jwt')
const validarRoles = require('./validar-roles')
const validarArchivo = require('./validar-archivo')


module.exports = {
    ...validarCampos,
    ...validarJwt,
    ...validarRoles,
    ...validarArchivo,
}