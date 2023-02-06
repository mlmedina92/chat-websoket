
// en este archivo voy a manipualr todo lo del SOCKET DEL LADO DEL CLIENTE y manipulando el dom para agregar inf

const socketClient = io()//instancio el socket del lado del cliente

// rescato elemetos del cliente
const nombreUsuario = document.getElementById('nombreUsuario')//h4 nombre
const formulario = document.getElementById('formulario')//form
const inputMensaje = document.getElementById('mensaje')//input mensaje
const chatParrafo = document.getElementById('chat')//parrafo q se rellenara dinamcamnete con los mjs enviados


let usuario = null

if (!usuario) { //si el us esta en nulo
    // le paso opciones a sweetalert, son prop que le paso a sweetalert
    Swal.fire({
        title: 'Bienvenido',
        text: 'ingrese su usuario en este input que agregaste como prop de sweet alert',
        input: 'text',
        inputValidator: (value) => {//le paso una prop q valide lo q ingreso en el input. en el inpu espero teenr un value
            if (!value) {//si no teng oun value
                return 'Necesitás ingresar un usuario'
            }
        },
    })
        // cdo le paso datos swett alert trabaja con promesas. cdo hagas ese swal fire, recibas una inf por input:  cdo la alerta da el okey , EMITE el evento cdo le doy okey se emite un evento

        .then(username => {
            // alguien ingresa su nombre en el input y suceden estas cosas
            usuario = username.value// a la constante us le paso el valor de username.value
            nombreUsuario.innerHTML = `NOMBRE usuario: ${usuario}`
            // CDO alguein inresa un nombre EMITI un evento q le llegue al serv con la inf de ese nuevo us
            socketClient.emit('nuevoUsuario', usuario)
        })
}

// escucho un evento submit cdo hagan click en enviar form.cdo alguien da clik en enviar emito un eevtnto, se crea unu objeto se emite un evento mjs y se refresca el input pasa a valer 0
formulario.onsubmit = (e) => {
    e.preventDefault()//para q no se refreque la pag q es lo q el submit hace por default

    // recupero la inf de los mensajes:
    const info = {
        nombre: usuario, //lo q me vino del input username
        mensaje: inputMensaje.value// el valor del elemto inputMensaje, es lo q le envio en tiempo real al servidor
    }

    socketClient.emit('mensaje', info)//le envio en tiempo real al servidor: un evento mensaje y le envio el objeto info. alguien da clik se crea el obj con la inf. se em imite este envento q mandar la info
    inputMensaje.value = '' // se refreca el valor
}

//   le digo al cliente q escuche el vento chat q vene del serv

socketClient.on('chat', infoMensajes => {
    console.log(infoMensajes);// POR CONSOLA DE GOOGLE:llega array de {nombre:'lis',mjs:'holA'} para verlo en pantalla modifico el dom con el parrafo chat:

    const chatRender = infoMensajes.map(elemento => {
        // retorna un ARREGOL q ya no tiene el objeto con prop nombre, mjs, si no un PARRAFO q va a tener el nombre y el mensaje con el join lo junto todo en un mismo string y se lo ingreso a chatParrafo q es el parrafo
        return `<p><strong>${elemento.nombre}</strong>${elemento.mensaje}</p>`
    }).join(' ')
    chatParrafo.innerHTML = chatRender
})


// escucah el evento broadcast q te viene con un usuario
socketClient.on('broadcast', usuario => {
    Toastify({
        text: `ingresó ${usuario} al chat`,
        duration: 5000,
        position: 'right',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast()
})
