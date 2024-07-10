const express = require('express');
const path = require('path');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const colors = require('colors');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();
const multer = require('multer'); // Para manejar la carga de archivos

const app = express();

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT;


const SESSION_FILE_PATH = './session.json';

let sessionData;

if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}


const client = new Client({
  puppeteer: {
     // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    handleSIGINT: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  authStrategy: new LocalAuth({ clientId: "Client-one" }),
  // webVersionCache: {
  //   type: 'remote',
  //   remotePath: 'https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/2.2413.51-beta-alt.html' // Tried 2.2412.54 still same result
  // }
});



process.on("SIGINT", async () => {
  console.log("(SIGINT) Shutting down...");
  await client.destroy();
  process.exit(0);
})


client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});




client.on('authenticated', (session) => {
  console.log('Conexión exitosa');
  sessionData = session;
  if (sessionData) {
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
});







// const mediaFilemp3 = MessageMedia.fromFilePath(`./public/media/${'image.mp3'}`)
// const mediaFilemp4 = MessageMedia.fromFilePath(`./public/media/${'image.mp4'}`)
// const mediaFilepdf = MessageMedia.fromFilePath(`./public/media/${'lahomeopatiatepuedesalvardeuncancer.pdf'}`)


let MSGbien = null; // inicia el Mensaje de bienvenida
let etapa = 0;

let registro = {

  '120363299706890441@g.us': { etapa: 0, numeroDocumento: '' },
  '573227151929@c.us': { etapa: 100, numeroDocumento: '' },
  '573170236840@c.us': { etapa: 100, numeroDocumento: '' },
  '573234714014@c.us': { etapa: 100, numeroDocumento: '' },
  '573152749108@c.us': { etapa: 100, numeroDocumento: '' },
  '573166639178@c.us': { etapa: 100, numeroDocumento: '' },
  '573228582339@c.us': { etapa: 100, numeroDocumento: '' },
  '573153377196@c.us': { etapa: 100, numeroDocumento: '' },



};
 // Registra los numeros telefono que inician al programa 


client.on('message', async (message) => {
  console.log(`Mensaje recibido de ${message.from}: ${message.body}`);

  const fileName = 'ventas.json';


  if (message.body.toLowerCase().includes("informex") && message.body !== '1') {
    // Enviar mensaje antes de la operación principal
    client.sendMessage(message.from, 'Estoy trabajando para usted.');

    if (fs.existsSync(fileName)) {
        const data = fs.readFileSync(fileName, 'utf8');
        const jsonData = JSON.parse(data);

        const currentDate = new Date();

        const objetosPorEnviar = Object.values(jsonData).filter(objeto => {
          const [day, month, year] = objeto.fecha.split('/');
          // Convertir la fecha del objeto al formato de fecha de JavaScript (mes/día/año)
          const fechaRegistro = new Date(`${month}/${day}/${year}`);
          // Calcular la diferencia en milisegundos
          const diffTime = currentDate.getTime() - fechaRegistro.getTime();
          // Calcular la diferencia en días
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          // Verificar si la diferencia es exactamente de 30 días
          return diffDays === 30;
      });

        if (objetosPorEnviar.length > 0) {
            objetosPorEnviar.forEach(objeto => {
                client.sendMessage(message.from, `Cliente vence hoy:\nNumero: ${objeto.numero}\nFecha: ${objeto.fecha}\nContenido: ${objeto.contenido}`);
            });
        } else {
            client.sendMessage(message.from, 'No hay clientes con exactamente 29 días desde la fecha registrada.');
        }
    } else {
        client.sendMessage(message.from, 'No se encontró el archivo JSON.');
    }
}






if (message.from === '573028634792@c.us' && /\d/.test(message.body)) {
  const [numero, fecha, contenido] = message.body.split('\n');

  const nuevoObjeto = {
      from: message.from,
      numero: numero,
      fecha: fecha,
      contenido: contenido
  };

  // Leer el archivo existente o crear uno nuevo si no existe
  let jsonData = [];
if (fs.existsSync(fileName)) {
    const data = fs.readFileSync(fileName, 'utf8');
    if (data.trim() !== '') {
        jsonData = JSON.parse(data);
    }
}

// Agregar el nuevo objeto al arreglo
jsonData.push(nuevoObjeto);

// Convertir el arreglo de objetos a una cadena JSON
const jsonString = JSON.stringify(jsonData, null, 2); // null, 2 para formatear la salida con indentación de 2 espacios

// Escribir la cadena JSON en el archivo
fs.writeFileSync(fileName, jsonString);

console.log('Guardado', 'Se ha guardado la información correctamente.');

client.sendMessage(message.from, 'David Guardó los datos correctamente');
}



if (!registro[message.from.toString()] && !message.from.toString().includes('@g.us') && !message.from.toString().includes('@g.us:')  ) {
  // Procesar el mensaje o hacer cualquier otra acción aquí
  // Enviar el mensaje de bienvenida, etc.
  client.sendMessage(message.from, '🎥 ¡Descubre el mejor entretenimiento en casa! 🏠 Con las plataformas de streaming líderes, somos una empresa confiable con más de 4 años de experiencia. ¡Disfruta de películas a un costo increíblemente bajo! 🍿 \n\n*ESCRIBA EL NUMERO DE SU ELECCION* \n\n1️⃣ Promociones  \n\n2️⃣ Soporte    ');

  registro[message.from.toString()] = { etapa: 0, numeroDocumento: '' };

  return;
}

if (MSGbien !== null) { // Check if MSGbien exists
  client.sendMessage(message.from, MSGbien);
  MSGbien = null; // Reset to a falsy value after sending
} else {
  console.log('Error al verificar el mensaje de bienvenida');
}









  // setTimeout(() => {
  //   delete registro[message.from];
  // }, 150 * 10000);






  if (!message.from.toString().includes('@g.us')) {
    switch (registro[message.from.toString()].etapa) {



    case 0:
      

    if (message.body.toLowerCase().includes("comprar") || message.body.toLowerCase().includes("1") ) {
      client.sendMessage(message.from, '🎥 *Escoje el número de tu preferencia*\n\n1️⃣ Netflix±Disney básico +Amazon prime video 22,000 por 30 días ( con Disney premium 28 mil )\n\n2️⃣ Netflix más Disney básico más hbo por 23,000 ( con Disney premium 29,000) \n\n3️⃣ Netflix más hbo + Amazon 22,000 por 30 días \n\n4️⃣ Netflix original sin caídas y renovables a 17 mil \n\n5️⃣ Disney+ 5 mil o Disney premiun a 9000 \n\n6️⃣ Amazon 6 mil \n\n7️⃣ HBO Max 5 mil \n\n8️⃣ Crunchyroll 8 mil \n\n9️⃣ PARAMOUNT+ 5 MIL \n\n🔟 VIX 9 MIL \n\n1️⃣1️⃣ Spotify 2 meses 14 mil \n\n1️⃣2️⃣ YouTube premium 1 mes a 7 mill \n\n1️⃣3️⃣ Vix pantalla por 30 días a 9 mil');
      registro[message.from].etapa = 30;
    
    } else if (message.body.toLowerCase().includes('2') || message.body.toLowerCase().includes('2') ) {
      client.sendMessage(message.from, 'Por favor envía una foto del problema y en unos minutos te daré la solución.');
      registro[message.from].etapa = 31;
    }

    break;



    case 30:

    if (/\d{1,}/.test(message.body)) {
      client.sendMessage(message.from, 'La entrega es inmediata solamente debes dejar tu comprobante de pago.\n\nBancolombia ahorros y Bancolombia ahorro a la mano \n*26400035406*\n\nNequi o daviplata \n*320 375 0163*\n\nNo olvides dejar el nombre para el perfil');
    }
    
    break;

    case 31:
    
    break;




      
  



   }
  }


});




// Desde aqui inica el cargue de la imagen al servidor 

// Configura multer para guardar las imágenes en la carpeta "media"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'media'); // Directorio de destino para las imágenes
  },
  filename: (req, file, cb) => {
    // Define el nombre del archivo como "image" y asegúrate de que sea único
    const extname = path.extname(file.originalname);
    const filename = 'image' + extname;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Verifica si el archivo ya existe en "media" y lo elimina si es necesario
    const filePath = path.join('media', 'image' + path.extname(file.originalname));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    cb(null, true);
  },
});

app.post('/upload', upload.single('image'), (req, res) => {
  // Mostrar un mensaje emergente en HTML
  const successMessage = `
    <div id="popup" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); text-align: center;">
      <p>Imagen cargada con éxito</p>
      <button onclick="closePopup()">Cerrar</button>
    </div>
    <script>
      function closePopup() {
        document.getElementById('popup').style.display = 'none';
        // Redirige de nuevo a la página anterior
        window.location.href = '/'; // Cambia esto al URL de tu página
      }
    </script>
  `;
  res.send(successMessage);
});


// 



let MSGenvio = true;




// Desde aqui Robot de envio Mesivo

client.on('auth_failure', (msg) => {
  console.error('Error de autenticación:', msg);
});


client.on('ready', () => {
  console.log('Cliente listo');
});

client.initialize();


app.use(bodyParser.json()); // Usar body-parser para analizar JSON
app.use(bodyParser.urlencoded({ extended: true })); // Usar body-parser para analizar datos codificados en URL

// Array para almacenar los registros de mensajes enviados
let registros = [];

// app.get('/', (req, res) => {
//   res.sendFile('index.html');
//  });


app.post('/procesar', (req, res) => {
  const { numbers, messages } = req.body;

  console.log('Números de Teléfono:', numbers);
  console.log('Mensajes:', messages);

  if (!numbers || !messages) {
    res.status(400).send('Los datos enviados no son válidos.');
    return;
  }

  if (!Array.isArray(numbers) || !Array.isArray(messages)) {
    res.status(400).send('Los datos enviados no son válidos.');
    return;
  }


  const sendMedia = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./media/${file}`)
    client.sendMessage(to, mediaFile)
  }


  // ///////////////////////////////////////

  let messageCounter = 0;



  app.post('/cambiar', (req, res) => {
    MSGenvio = !MSGenvio; // Cambiamos el valor de MSGenvio
    res.json({ MSGenvio });
  });





  setInterval(() => {
    console.log("MSGenvio:", MSGenvio);
  }, 1000);


  app.use(express.json());

  // ///////////////////////////////////////////////////////////////


  numbers.forEach((phoneNumber, index) => {
    const phoneNumberWithSuffix = `${phoneNumber}@c.us`;
    const message = messages[index] || ""; // Asigna una cadena vacía si el mensaje no está presente para ese número



    setTimeout(() => {

      if (MSGenvio) {
        sendMedia(phoneNumberWithSuffix, 'image.jpg');
      }
      client.sendMessage(phoneNumberWithSuffix, message)
        .then(() => {
          const registro = {
            mensaje: `Mensaje ${++messageCounter} enviado a ${phoneNumberWithSuffix}`,
            numero: phoneNumberWithSuffix
          };

          registros.push(registro); // Agregar el registro al array de registros
          console.log(registro.mensaje.green);

          // Verifica si estás en el último elemento del array
          if (index === numbers.length - 1) {
            registros.push({ mensaje: 'Terminé de enviar los mensajes', numero: 'Oprima el boton borra registro' });
            console.log('Terminé de enviar');
          }
        })
        .catch((error) => {
          console.log(`Error al enviar el mensaje a ${phoneNumberWithSuffix}: ${error.message}`.red);
        });
    }, 15000 * (index + 1));
  });




  res.status(200).send('Datos recibidos correctamente');


  app.get('/registros', (req, res) => {
    const ultimosRegistros = registros.slice(-10); // Obtener los últimos 10 registros

    res.json(ultimosRegistros); // Enviar los últimos 10 registros como respuesta en formato JSON
  });

});

// Ruta para borrar los registros
app.delete('/borrar-registros', (req, res) => {
  registros.length = 0; // Borra todos los registros
  res.json({ message: 'Registros borrados exitosamente' });
});






app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});