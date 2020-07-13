// Cuando termine de cargar el html poblamos la tabla
document.addEventListener("DOMContentLoaded", function() {
  fetchData();
});

// Esta funcion carga la tabla apenas carga la pagina
// fetch() es el método nativo de los navegadores para hacer peticiones AJAX
// se usa con promesas ya que es Asynchronous JavaScript And XML
function fetchData() {
  fetch('https://hello-database-marin37.herokuapp.com/api/users')
    .then(res => res.json())
    .then(users => {
      populateTable(users);
    });
}

// Esta funcion carga los usuarios en la tabla
// crea una fila en la tabla por cada (forEach) elemento en el array users
function populateTable(users) {
  for (let user of users) {
    // Sacar de encima las propiedades que no queremos en la tabla
    delete user._id;
    delete user.__v;
    // Agregamos la edad actual para la anteultima columna
    let now = new Date();
    user.age = now.getFullYear() - new Date(user.birthday).getFullYear();
    // Formateamos la fecha de cumpleaños para que salga como string
    let birthday = new Date(user.birthday);
    user.birthday = birthday.toLocaleDateString('es-AR');
    // Creamos una fila
    let row  = document.createElement('tr');
    for (let key in user) {
      // Insertamos una columna por cada propiedad
      let col = document.createElement('td');
      col.innerHTML = user[key];
      row.append(col);
    }
    // Insertamos la fila al tbody y repetimos
    document.getElementById('tbody').append(row);
  }
}

// Esta funcion carga un solo usuario en la tabla
function fetchUser() {
  let id = document.getElementById('userID').value;
  // Si el id NO es un numero terminamos rápido con return;
  if (isNaN(id)) return;
  fetch(`https://hello-database-marin37.herokuapp.com/api/user/${id}`)
    .then(res => res.json())
    .then(user => {
      let users = [user];  // populateTable necesita un array de objetos como argumento
      // Si tenemos un usuario con id existente lo cargamos en la tabla
      if (users[0] !== null) {
        // Reemplazar el tbody viejo por uno nuevo con el siguiente usuario que encontremos
        let oldTBody = document.getElementById('tbody');
        let newTBody = document.createElement('tbody');
        newTBody.id = 'tbody';
        oldTBody.replaceWith(newTBody);
        // Cargamos los datos a la fila
        populateTable(users);
        // Actualizamos la UI
        document.getElementById('table').hidden = false;
        document.getElementById('nores').innerHTML = '';
      } else {
        // Si no hay usuario con ese ID mostramos un mensaje
        document.getElementById('table').hidden = true;
        document.getElementById('nores').innerHTML = 'No hay resultados';
      }
    });
}
