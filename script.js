const contenedorPersonajes = document.getElementById("contenedorPersonajes");
const idPersonajeInput = document.getElementById("idPersonaje");
const claveLocalStorage = "personajesRickYmorty";

function buscarYMostrarPersonaje() {
    const idPersonaje = parseInt(idPersonajeInput.value);
    if (isNaN(idPersonaje)) {
    alert("Ingrese un número válido de ID.");
    return;
    }

    if (idPersonaje <= 0 || idPersonaje > 826) {
    alert("Seleccione un número entre 1 y 826.");
    return;
    }

    if (verificarPersonajeDuplicado(idPersonaje)) {
      return; // Salir si el personaje ya está duplicado
    }

    fetch(`https://rickandmortyapi.com/api/character/${idPersonaje}`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
        alert("Personaje no encontrado.");
        } else {
        mostrarPersonaje(data);
        guardarPersonajeEnLocalStorage(data);
        }
    })
    .catch(error => console.error("Error al obtener el personaje:", error));
}


function guardarPersonajeEnLocalStorage(personaje) {
    let personajes = JSON.parse(localStorage.getItem(claveLocalStorage)) || [];
    if (!personajes.some(char => char.id === personaje.id)) {
    personajes.push({ id: personaje.id, name: personaje.name, status: personaje.status, species: personaje.species, image: personaje.image });
    localStorage.setItem(claveLocalStorage, JSON.stringify(personajes));
    }
}


function mostrarPersonaje(personaje) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");
    tarjeta.setAttribute("data-id", personaje.id);

    tarjeta.innerHTML = `
    <h2>${personaje.name ? personaje.name : 'Nombre desconocido'}</h2>
    <img src="${personaje.image ? personaje.image : 'URL_de_imagen_por_defecto'}" alt="${personaje.name ? personaje.name : 'Nombre desconocido'}" style="max-width: 100%;">
    <p>Estado: ${personaje.status ? personaje.status : 'Estado desconocido'}</p>
    <p>Especie: ${personaje.species ? personaje.species : 'Especie desconocida'}</p>
    <button onclick="eliminarPersonaje(${personaje.id})" class="btn-eliminar">Eliminar</button>
    `;

    contenedorPersonajes.appendChild(tarjeta);
}

function borrarTodosLosPersonajes() {
localStorage.removeItem(claveLocalStorage);
contenedorPersonajes.innerHTML = "";
}

window.onload = function() {
    const personajes = JSON.parse(localStorage.getItem(claveLocalStorage)) || [];
    const personajesUnicos = [...new Set(personajes.map(personaje => personaje.id))];

    personajesUnicos.forEach(id => {
    const personaje = personajes.find(personaje => personaje.id === id);
    mostrarPersonaje(personaje);
    });
};


function verificarPersonajeDuplicado(idPersonaje) {
    const personajes = JSON.parse(localStorage.getItem(claveLocalStorage)) || [];
    if (personajes.some(personaje => personaje.id === idPersonaje)) {
    alert("Este personaje ya ha sido agregado.");
    return true;
    }
    return false;
} 
function eliminarPersonaje(idPersonaje) {
    const tarjetaAEliminar = document.querySelector(`[data-id="${idPersonaje}"]`);
    if (tarjetaAEliminar) {
      tarjetaAEliminar.remove(); // Elimina la tarjeta de la página

      // Elimina el personaje del almacenamiento local
    const personajes = JSON.parse(localStorage.getItem(claveLocalStorage)) || [];
    const personajesActualizados = personajes.filter(personaje => personaje.id !== idPersonaje);
    localStorage.setItem(claveLocalStorage, JSON.stringify(personajesActualizados));
    }
}

