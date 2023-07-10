const { Socket } = require("socket.io")
const { ChatMensajes } = require("../models")
const { comprobarJWT } = require("../helpers")


const chatMensajes = new ChatMensajes()

const socketController = async( socket /* = new Socket() */, io ) => {

    const token = socket.handshake.headers['x-token']

    const usuario = await comprobarJWT(token)

    if( !usuario ){
        return socket.disconnect()
    }

    
    // Agregar | Conectar usuario
    chatMensajes.conectarUsuario( usuario )
    console.log('Se conecto', usuario.nombre)
    socket.emit('recibir-mensajes', chatMensajes.ultimosDiez)

    // Conectarlo a una sala especial
    socket.join(usuario.id) //global, socket.id, usuario.id


    // Emitir usuarios conectados
    io.emit('usuarios-activos', chatMensajes.usuariosArr)


    // Desconectar usuario
    socket.on('disconnect', ()=>{
        chatMensajes.desconectarUsuario( usuario.id )
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    })

    socket.on('enviar-mensaje', ({ mensaje, uid }) => {
        if(uid){
            // Mensaje privado
            socket.to( uid ).emit('mensaje-privado',{
                de: usuario.nombre,
                mensaje
            })
        }else {
            // Mensaje global
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje)
            io.emit('recibir-mensajes', chatMensajes.ultimosDiez)
        }
    })

    
}


module.exports = {
    socketController
}