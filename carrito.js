//* VARIABLES 
let carrito = [];// Creamos el Array del carrito vacio
const divCarrito = document.querySelector('#carrito'); // Seleccionamos el div donde está la tabla del carrito
const cuerpoTablaCarrito = document.querySelector('#lista-carrito tbody'); // Seleccionamos el cuerpo de la tabla de nuestro carrito, aquí pondremos toda la información
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');// El boton para vaciar el carrito
const listaDeJuegos = document.querySelector('#listaDeJuegos');// Este es el div que contiene todos los juegos en venta
let totalPagar = document.querySelector('.total b');
const spinner = document.querySelector('.spinner');

//* Funciones
cargarEventListeners(); // Con este cargamos todos los eventos

function cargarEventListeners() {
  listaDeJuegos.addEventListener('click', agregarJuego);// Esto es para cuando se hace clic en el botón del juego, se llame a la funcion que agrega el producto al carrito
  divCarrito.addEventListener('click', eliminarJuego); // Al dar clic en el botón x del curso, se ejecutará esta función
  
  // Muestra los juegos en localStorage
  document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    totalPagar.textContent =`$${localStorage.getItem('total')}` && '$0';
    addCarritoHTML();
  });
  
  vaciarCarritoBtn.addEventListener('click', () => {
    console.log('vaciando carrito...');
    spinner.style.display = 'block';
    setTimeout(() => {
      carrito.splice(0);// Reseteamos el carrito
      limpiarHTML(); // Eliminamos todo el HTML
      localStorage.removeItem('carrito');
      localStorage.removeItem('total');
      totalPagar.textContent = '$0';
      spinner.style.display = 'none';
    }, 2000);
  });
}

function agregarJuego(e) {
  e.preventDefault();// Previenes que haga la accion por default

  // if para que si el boton tiene la clase agregarAlCarrito, extraiga todo el div del mismo, y asi obtener la información, como el precio, la portada, etc.
  if (e.target.classList.contains('agregarAlCarrito')) {
    const juegoSeleccionado = e.target.parentElement.parentElement;// Con esto extraes todo el div donde viene toda la inforación
    // console.log(juegoSeleccionado);

    leerDatosJuego(juegoSeleccionado); // Llamamos esta fucnión y le pasamos de parametro el div del juego con toda la info
  }
  // console.log(carrito);
}

// Eliminar un juego del carrito.
function eliminarJuego(e) {
  if(e.target.classList.contains('borrarCurso')) {

    // Obtenemos el ID del juego que queremos eliminar
    const juegoId = e.target.getAttribute('data-id');

    // Revisamos si el juego está mas de dos veces e el carrito.
    const producto = carrito.filter(juego => juego.id === juegoId);

    if(producto[0].cantidad > 1) {
      const games = carrito.map(juego => {
        if(juego.id === juegoId) {
          juego.cantidad--; 
          return juego; // Esto para que retorne la cantidad actualizada
        } else {
          return juego; // Si no hay mas de uno, lo regresa normal
        }
      });
      carrito = [...games];
    } else {
      // Elimina del arreglo de carrito por el data-id.
      carrito = carrito.filter( juego => juego.id !== juegoId);
    }

    const totalito = carrito.reduce((total, juego) => total + Number(juego.precio) * juego.cantidad, 0);
    console.log(totalito);
    totalPagar.textContent = `$${totalito}`;
    localStorage.setItem('total', totalito); // Lo guardamos e el localStorage

    addCarritoHTML(); // Iteramos sobre el carrito y mostramos el HTML
  }
}


function leerDatosJuego(juego) {
  // Creamos un objeto con los datos del juego
  const infoJuego = {
    imagen: juego.querySelector('img').src,
    nombre: juego.querySelector('h3').textContent,
    precio: juego.querySelector('span').textContent,
    id: juego.querySelector('button').getAttribute('data-id'),
    cantidad: 1,
  }

  //Revisamos si ya existe el producto en el carrito, esto para que no se ponga más de dos veces y en lugar de eso, se cambie la cantidad
  const existe = carrito.some(juego => juego.id === infoJuego.id);
  if(existe) {
    const juegos = carrito.map(juego => {
      if(juego.id === infoJuego.id) {
        juego.cantidad++;
        return juego; // Esto para que retorne la cantidad actualizada
      } else {
        return juego; // Si no hay mas de uno, lo regresa normal
      }
    });
    carrito = [...juegos];
    
  } else {
    carrito = [...carrito, infoJuego];
    // console.log(carrito);
  }

  // Calculamos el total
  const totalito = carrito.reduce((total, juego) => total + Number(juego.precio) * juego.cantidad, 0);
  // console.log(totalito);
  totalPagar.textContent = `$${totalito}`;
  localStorage.setItem('total', totalito); // Lo guardamos e el localStorage

  addCarritoHTML();
}

//Muestra el carrito de compras en el HTML
function addCarritoHTML() {
  // Limpiar HTML
  limpiarHTML();

  // Recorre el carrito y genera HTML
  carrito.forEach(juego => {
    const { imagen, nombre, precio, cantidad, id } = juego;
    const row = document.createElement('tr');

    row.innerHTML = `
    <td>
      <img src="${imagen}" width="100">
    </td>
    <td>
      ${nombre}
    </td>
    <td>
      $${precio}
    </td>
    <td>
      ${cantidad}
    </td>
    <td>
      <a href="#" class="borrarCurso" data-id=${id}>X</a>
    </td>`
    // Agrega el HTML del carrito en el tbody
    cuerpoTablaCarrito.appendChild(row);

  });

  // Agregar el carrito al Storage
  addStorage();
}

function addStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Eliminar los cursos del tbody
function limpiarHTML() {
  // forma lenta
  //// carrito.innerHTML = '';
  while(cuerpoTablaCarrito.firstChild) {
    cuerpoTablaCarrito.removeChild(cuerpoTablaCarrito.firstChild);
  }
}