
// https://restserver-nodejs.up.railway.app/   :: Production
const formulario = document.querySelector('form')

const url = ( window.location.hostname.includes('localhost') )
    ? 'http://localhost:8080/api/auth'
    : 'https://restserver-nodejs.up.railway.app/api/auth'


formulario.addEventListener('submit', (ev) => {
    ev.preventDefault()

    const formData = {}
    
    for( let elemt of formulario.elements){
        if( elemt.name.length > 0 ){
            formData[elemt.name] = elemt.value
        }
    }

    fetch(`${url}/login`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then( resp => resp.json() )
    .then( ({ msg, usuario, token }) => {
        if( msg ){
            return console.log(msg)
        }

        localStorage.setItem('google-cafe-token', token)
        localStorage.setItem('google-cafe-email', usuario.correo)

        window.location = 'chat.html'

    })
    .catch( err => {
        console.log(err)
    })
})


function handleCredentialResponse(response) {

    // Google Token
    // console.log('id_token: ', response.credential );

    const body = { id_token: response.credential }

    fetch(`${url}/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(result => {
            // console.log('user =>',result)
            console.log({token: result.token});
            localStorage.setItem('google-cafe-token', result.token)
            localStorage.setItem('google-cafe-email', result.usuario.correo)

            window.location = 'chat.html'

        })
        .catch(console.warn)

}


// Cerrar Sesión de google
const btnSignOut = document.querySelector('#google_signout')
btnSignOut.onclick = () => {

    const emailActive = localStorage.getItem('google-cafe-email') || null

    if (!emailActive) {
        return
    }

    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke(emailActive, done => {
        localStorage.removeItem('google-cafe-token')
        localStorage.removeItem('google-cafe-email')
        location.reload()
    })
}