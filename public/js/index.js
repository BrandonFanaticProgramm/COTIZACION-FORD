
const containerVehiculos = document.querySelector('.Opciones-Vehiculos');
const containerCiudades = document.querySelector('.form-ciudades');
const containerConcesarios = document.querySelector('.Concesonario-form');
const form = document.querySelector('.form');
const btn_send = document.querySelector('#Btn-Send');

function message(){
    document.addEventListener('DOMContentLoaded',() => {
        alert('Por favor al hacer una nueva cotizacion actualizar la pagina, pronto actualizo para que funcione sin necesidad de recargar la pagina. Muchas Gracias');
    })
}

message();

// Vehiculos
fetch(`/vehiculos`)
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
fetch(`/ciudades`)
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
fetch(`/concesionarios`)
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
form.addEventListener('submit',async(e) => {
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

    const response = await fetch(`/datos_usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const result = await response.json(); 
    const id_usuario = result.insertId;
    // REENVIO AL PDF
    
    btn_send.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `/cotizacion/${id_usuario}`;
    })
});
