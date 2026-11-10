const botonAccesoPrueba = document.getElementById("acceso-prueba");
const campoCorreo = document.getElementById("correo");
const campoPassword = document.getElementById("password");
const formularioLogin = document.getElementById("formulario-login");
const mensajeLogin = document.getElementById("mensaje-login");
const botonIngresar = document.getElementById("ingresar");

botonAccesoPrueba.addEventListener("click", () => {
    campoCorreo.value = "admin@lootvalley.test";
    campoPassword.value = "PruebaLocal123!";
});

let enviandoLogin = false;

formularioLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (enviandoLogin) {
        return;
    }

    enviandoLogin = true;
    botonIngresar.disabled = true;
    mensajeLogin.textContent = "";

    try {
        const respuesta = await fetch("/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: campoCorreo.value,
                password: campoPassword.value
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "No se pudo iniciar sesión.");
        }

        window.location.replace("/admin/dashboard");
    } catch (error) {
        mensajeLogin.textContent = error.message;
    } finally {
        enviandoLogin = false;
        botonIngresar.disabled = false;
    }
});