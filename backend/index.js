const express = require("express");
const app = express();
const PUERTO = 3000;

app.get("/", (req,res) => {
    res.send("Servidor de LV - Loot Valley funcionando");
});

app.listen(PUERTO, () => {
    console.log(`Servidor disponible en http://localhost:${PUERTO}`);
});