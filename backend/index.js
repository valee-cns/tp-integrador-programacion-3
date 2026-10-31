const express = require("express");
const app = express();
const PUERTO = 3000;
const path = require("path");

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.listen(PUERTO, () => {
    console.log(`Servidor disponible en http://localhost:${PUERTO}`);
});