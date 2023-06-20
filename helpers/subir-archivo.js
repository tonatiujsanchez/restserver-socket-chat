
const path = require('path')
const { v4: uuidv4 } = require('uuid')


const subirArchivo = ( files, extencionesPermitidas = ['png', 'jpg', 'jpeg', 'gif', 'webp'], directorio = '' ) => {


    return new Promise(( resolve, reject )=>{

        const { archivo } = files
        const nombreCortado = archivo.name.split('.')
        const extencion = nombreCortado[ nombreCortado.length - 1 ]
    
        // validar las extención
        if( !extencionesPermitidas.includes(extencion) ){
            return reject(`Extención de archivo no válido :: ${ extencionesPermitidas }`)
        }
    
        const nombreTemp = `${ uuidv4() }.${ extencion }`
        const uploadPath = path.join(__dirname, '../uploads/', directorio, nombreTemp)
    
        archivo.mv(uploadPath, (err) => {
            if (err) {
                console.log(err)
                return reject('Error al subir el archivo', err)
            }

            resolve(nombreTemp)
        })


    })



}


module.exports = {
    subirArchivo
}