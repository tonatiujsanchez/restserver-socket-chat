const { Router } = require('express')
const router = Router()

const { 
    getUsuarios, 
    postUsuarios, 
    putUsuarios, 
    patchUsuarios, 
    deleteUsuarios
} = require('../controllers/usuarios')


router.get('/', getUsuarios)

router.post('/', postUsuarios)

router.put('/:id', putUsuarios)

router.patch('/', patchUsuarios)

router.delete('/', deleteUsuarios)



module.exports = router