
const containerVehiculos = document.querySelector('.Opciones-Vehiculos');
fetch('http://localhost:5000/vehiculos')
    .then(response => response.json()) 
    .then(data => {
        data.forEach(vehiculo => {

            const optionVehiculo = document.createElement('option');
            optionVehiculo.innerText = vehiculo.nombre;
            optionVehiculo.setAttribute('Value', vehiculo.nombre);
            containerVehiculos.appendChild(optionVehiculo);
        });
    })

    .catch(err => {
        console.log(err);
    })