const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body

    try {
        let usuario = await Usuario.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            })
        }

        usuario = new Usuario(req.body)

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save();

        // Generar el JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({ ok: true, msg: 'Registrado', uid: usuario.id, name: usuario.name, token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' })
    }

}

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.json({ ok: true, msg: 'login', uid: usuario.id, name: usuario.name, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' })
    }

}

const revalidarToken = async (req, res = response) => {

    try {
        const uid = req.uid
        const name = req.name

        // Generar el JWT
        const token = await generarJWT(uid, name)

        res.json({ ok: true, token, uid, name })
    } catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, msg: 'Por favor hable con el administrador' })
    }
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}