// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Esta línea es la clave. Le dice a Express que la carpeta 'public'
// contiene todos los archivos que debe servir.
app.use(express.static(path.join(__dirname, 'public')));

// Opcional: Si quieres ser explícito, puedes agregar una ruta para el archivo raíz
// app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, 'public', 'game.html'));
// });

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});