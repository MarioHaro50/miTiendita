//* VARIABLES
const divJuegos = document.querySelector('#listaDeJuegos');// Contenedor de los resultados
const selectPlataforma = document.querySelector('#plataforma');// Select donde vienen las opciones

// Object que se usará para buscar en el Array
const datosBusqueda = {
  consola: ''
}


//* EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  mostrarJuegos(juegos);
});

selectPlataforma.addEventListener('change', e => {
  datosBusqueda.consola = e.target.value;
  filtrarJuego();
});


//* FUNCIONES
function mostrarJuegos(juegos) {
  limpiarHTMLProductos();

  juegos.forEach(juego => {
    const { nombre, precio, consola, img, id } = juego;
    const juegoHTML = document.createElement('div');
    
    juegoHTML.classList.add('producto');
    juegoHTML.innerHTML = `
      <img src="${img}" alt="">
      <div class="info-producto">
        <h3>${nombre}</h3>
        <h5>${consola}</h5>
        <p>$<span>${precio}</span></p>
        <button class="agregarAlCarrito" data-id="${id}">Agregar al carrito</button>
      </div>
    `;

    divJuegos.appendChild(juegoHTML);
  });
}

function limpiarHTMLProductos() {
  while(divJuegos.firstChild) {
    divJuegos.removeChild(divJuegos.firstChild);
  }
}

function filtrarJuego() {
  const resultado = juegos.filter(filtrarPlataforma);

  if(resultado.length) {
    mostrarJuegos(resultado);
  } else {
    noResultado();
  }
}

function noResultado() {
  limpiarHTMLProductos();

  const noResultado = document.createElement('div');
  noResultado.classList.add('alerta');
  noResultado.textContent = 'No hay ningun resultado';

  divJuegos.appendChild(noResultado);
}

function filtrarPlataforma(juego) {
  const {consola} = datosBusqueda;
  if(datosBusqueda.consola) {
    return juego.consola === consola;
  }
  return juego;
}