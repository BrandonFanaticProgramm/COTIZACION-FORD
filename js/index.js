
const containerVehiculos = document.querySelector('.Opciones-Vehiculos');
const containerCiudades = document.querySelector('.form-ciudades');
const containerConcesarios = document.querySelector('.Concesonario-form');
// Vehiculos
fetch('http://localhost:5000/vehiculos')
    .then(response => response.json()) 
    .then(data => {
        data.forEach(vehiculo => {
            const optionVehiculo = document.createElement('option');
            optionVehiculo.innerText = vehiculo.nombre;
            optionVehiculo.setAttribute('Value', vehiculo.nombre);
            optionVehiculo.setAttribute('id-vehiculo', vehiculo.id_vehiculo);
            containerVehiculos.appendChild(optionVehiculo);
        });
    })

    .catch(err => {
        console.log(err);
    });

//Ciudades
fetch('http://localhost:5000/ciudades')
    .then(response => response.json())
    .then(data => {
        data.forEach(ciudad => {
            const containerCiudad = document.createElement('option');
            containerCiudad.innerText = ciudad.nombre;
            containerCiudad.setAttribute('value', ciudad.nombre);
            containerCiudad.setAttribute('id-ciudad', ciudad.id_ciudad)
            containerCiudades.appendChild(containerCiudad);
        })
    });

// Concesionarios
fetch('http://localhost:5000/concesionarios')
    .then(response => response.json())
    .then(data => {
        data.forEach(concesionario => {
            const optionConcesionario = document.createElement('option');
            optionConcesionario.innerText = concesionario.nombre;
            optionConcesionario.setAttribute('value', concesionario.nombre); // "value"
            optionConcesionario.setAttribute('id-concesionario',concesionario.id_concesionario)
            containerConcesarios.appendChild(optionConcesionario);
        });
    })
    .catch(err => console.log('Error al obtener concesionarios:', err));

// RECOLECCION DE INFORMACION DEL FORMULARIO

const form = document.querySelector('.form');

form.addEventListener('submit',(e) => {
    e.preventDefault();
    const nombre = document.querySelector('#Nombre').value;
    const apellido = document.querySelector('#Apellido').value;
    const email = document.querySelector('#Email').value;
    const telefono = document.querySelector('#Telefono').value;
    const concesionario = document.querySelector('#concesionarios');
    const concesionarioSeleccionado = concesionario.options[concesionario.selectedIndex].getAttribute('id-concesionario');
    const ciudad = document.querySelector('#ciudades');
    const ciudadSeleccionada = ciudad.options[ciudad.selectedIndex].getAttribute('id-ciudad');
    const vehiculo = document.querySelector('#vehiculos');
    const vehiculoSeleccionado = vehiculo.options[vehiculo.selectedIndex].getAttribute('id-vehiculo');
    const formData = {
        nombre,
        apellido,
        email,
        telefono,
        concesionarioSeleccionado,
        ciudadSeleccionada,
        vehiculoSeleccionado
    }

    fetch('http://localhost:5000/datos_usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
});