const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Le decimos que los archivos visuales estarán en la carpeta "public"
app.use(express.static('public'));

// Memoria del servidor para guardar los datos actuales
let sharedPlayers = [
  { id: 1, x: null, z: null, yaw: null }
];

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');
  
  // Cuando alguien entra, le mandamos los datos actuales
  socket.emit('sync-data', sharedPlayers);

  // Cuando alguien actualiza un dato (pega código o edita), actualizamos a todos
  socket.on('update-data', (data) => {
    sharedPlayers = data;
    // Broadcast envía a todos los demás conectados
    socket.broadcast.emit('sync-data', sharedPlayers);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Servidor corriendo en el puerto ' + PORT);
});