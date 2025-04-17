/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express')
const { check } = require('express-validator')
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth.controller')
const { validarCampos } = require('../middlewares/validarCampos')
const { validarJWT } = require('../middlewares/validarJWT')

const router = Router()

router.post(
    '/new',
    [ // Middleware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email no tiene el formato correcto').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario
)
router.post(
    '/',
    [ // Middleware
        check('email', 'El email no tiene el formato correcto').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario
)
router.get('/renew', validarJWT, revalidarToken)

module.exports = router