
const h1 = document.querySelector('h1')
h1.innerText = `Cargando...`

const url = ( window.location.hostname.includes('localhost') )
    ? 'http://localhost:8080/api/auth'
    : 'https://restserver-nodejs.up.railway.app/api/auth'



let usuario = null
let socket   = null

const textUid     = document.querySelector('#textUid')
const textMensaje = document.querySelector('#textMensaje')
const ulUsuarios  = document.querySelector('#ulUsuarios')
const ulMensajes  = document.querySelector('#ulMensajes')
const btnSalir    = document.querySelector('#btnSalir')


textMensaje.addEventListener('keyup', ({ keyCode })=>{
    
    const mensaje = textMensaje.value.trim()
    const uid     = textUid.value.trim()

    if( keyCode !== 13 ){ return }

    if( mensaje.length === 0 ){ return }

    socket.emit('enviar-mensaje', { mensaje, uid })

    textMensaje.value = ''

})


const validarJWT = async() => {
    // Validar el JWT del local storage

    const token = localStorage.getItem('google-cafe-token') || ''

    if( token.trim().length <= 0 ){
        window.location = 'index.html'
        throw new Error('No hay token de sesión')
    }

    const resp = await fetch( url, {
        headers: {'x-token':token}
    })
    const { usuario:usuarioDB, token:tokenDB } = await resp.json()

    if(!resp.ok){
        window.location = 'index.html'
        throw new Error(usuarioDB.msg)
    }
   
    localStorage.setItem('google-cafe-token', tokenDB)
    localStorage.setItem('google-cafe-email', usuarioDB.correo)
    usuario= usuarioDB
    h1.innerText = `Hola ${usuarioDB.nombre} 👋`

    document.title = usuarioDB.nombre

    await conectarSocket()
}

const conectarSocket = async() => {
    
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('google-cafe-token')
        }
    })


    socket.on('connect', ()=>{
        console.log('Socket online')
    })


    socket.on('disconnect', ()=>{
        console.log('Socket offline')
    })


    socket.on('recibir-mensajes', mostrarMensajes)


    socket.on('usuarios-activos', mostrarUsuarios )


    socket.on('mensaje-privado', (payload) => {
        console.log('Privado:', payload)
    })
}


const mostrarUsuarios = ( usuarios = [] ) => {
    
    let usuariosHtml = ''

    usuarios.forEach(({ nombre, uid }) => {
        usuariosHtml += `
            <li>
                <div class="mb-3">
                    <p class="text-success fw-bold mb-0">${ nombre }</p>
                    <span class="fs-6 text-muted">${uid}</span>
                </div>
            </li>
        `
    })

    ulUsuarios.innerHTML = usuariosHtml
}

const mostrarMensajes = ( mensajes = [] ) => {

    let mensajesHtml = ''

    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHtml += `
            <li class="d-flex">
                <div class="mb-3">
                    <p class="text-primary fw-bold mb-0">${ nombre }</p>
                    <span class="fs-6 text-muted">${ mensaje }</span>
                </div>
            </li>
        `
    })

    ulMensajes.innerHTML = mensajesHtml
}


const main = async () => {
    
    await validarJWT()    
    
}
main()






