//Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');

const gastoListado = document.querySelector('#gastos ul');





//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);

};



//Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto (gasto){
        // console.log(gasto);
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
        // console.log(this.gastos);

    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) =>
        total + gasto.cantidad, 0)

        this.restante = this.presupuesto - gastado;
        // console.log(gastado);
        // console.log(this.restante)

    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id != id);

        // console.log(this.gastos)
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto (cantidad){
        // console.log(cantidad);
        //Extrayendo el valor
        const {presupuesto, restante} = cantidad;

        //Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;

        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        //Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //Quitar del HTML
        setTimeout(() =>{
            divMensaje.remove()
        },3000);
    }

    mostrarGastos(gastos){
        // console.log(gastos)

        this.limpiarHTML(); //Elimina el HTML previo

        //Iterar sobre los gastos
        gastos.forEach( gasto => {
            // console.log(gasto);
            const {cantidad, nombre, id} = gasto;

            //Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';

            // nuevoGasto.setAttribute('data-id', id);

            nuevoGasto.dataset.id = id;

            // console.log(nuevoGasto)

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad} </span>
            `;

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');

            btnBorrar.innerHTML = 'Borrar &times;'

            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);
           
            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
            
        });
    }

    limpiarHTML(){ //Elimina el listado gasto repetido del array
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoOBJ){
        const {presupuesto, restante} = presupuestoOBJ;

        const restanteDiv = document.querySelector('.restante');

        //Comprobar 25%
        if((presupuesto / 4) > restante){
            // console.log("ya gastaste el 75%")
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-danger', 'alert-warning');
        }else if((presupuesto / 2 ) > restante){
            restanteDiv.classList.remove('alert-success', "alert-danger")
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el total es 0 o menor
        if(restante <= 0 ){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type = "submit"]').disabled = true;
        }
    }

}



//Instanciar
const ui = new UI;
let presupuesto;


//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');

    // console.log(parseFloat( presupuestoUsuario));
    // console.log(Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario<= 0){
        window.location.reload(); //Mantiene el console log abierto
    }

    
    //Presupuesto Valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    // console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

//Añade Gastos
function agregarGasto(e){
    e.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar
    if(nombre === '' || cantidad === ''){
        // console.log('Ambos campos sonobligatorios')
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return; // para que no se ejecuten las sgtes lineas de codigo
    }else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error')
        return;
    }

    // console.log('Agregando Gasto')
    // Generar objeto de tipo gasto
    const gasto = {nombre, cantidad, id:Date.now()} //Une nombre y cantdad a "gasto"
    // const {nombre, cantidad} = gasto; //Extrae nombre y cantidad de gasto

    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // console.log(gasto);

    //Mensaje de Todo Correcto
    ui.imprimirAlerta('Gasto Agregado correctamente');

    //Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante (restante);

    ui.comprobarPresupuesto (presupuesto);

    //Reinicia formulario
    formulario.reset();
}

function eliminarGasto(id){
    //Elimina del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante (restante);

    ui.comprobarPresupuesto (presupuesto);

}