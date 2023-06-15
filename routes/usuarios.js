const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')

const { validarCampos, validarJWT, esAdminRol, tieneRol } = require('../middlewares')

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators')

const { 
    getUsuarios, 
    postUsuarios, 
    putUsuarios, 
    patchUsuarios, 
    deleteUsuarios
} = require('../controllers/usuarios')



router.get('/', getUsuarios)

router.post(
    '/', 
    [
        check('nombre', "El nombre es obligatorio").not().isEmpty(),
        check('password', "El password esbe tener al menos 6 caracteres").isLength({ min: 6 }),
        check('correo', "El correo no es válido").isEmail(),
        check('correo').custom( emailExiste ),
        // check('rol', "El rol no es válido").isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom( esRoleValido ),
        validarCampos
    ], 
    postUsuarios
)

router.put(
    '/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRoleValido ),
        validarCampos
    ],
    putUsuarios
)


router.delete(
    '/:id',
    [
        validarJWT,
        // esAdminRol,
        tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
    ]
    ,
    deleteUsuarios
)

router.patch('/', patchUsuarios)


module.exports = router