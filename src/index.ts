// Colocar las librerias de Azle que vamos a utilizar

import {Canister, query, update, Void, Record, text, bool, StableBTreeMap, Principal, Vec, Err, Ok , Opt, Result, Variant } from 'azle';

//& Crear un objeto con una id, Actividad, estado
//Id es el identificador de cada tarea
//actividad es la Actividad de la tarea
//Estado es un bool donde 0 es incompleto y 1 completo
const Tarea = Record({
    id: Principal,
    actividad: text,
})

const Errores = Variant({
    tareaNoExiste: Principal
})


//variables 
let id = text;
let actividad = text;

//& MAP
let tareas = StableBTreeMap(Principal, Tarea, 0);

export default Canister({
    //Creamos una tarea, con el nombre de la actividad
    crearTarea: update([text],Tarea, (actividad) => {
        //? Funcion para generar la ID
        const id = generarID();

        //^ Modicar las variables
        const tarea: typeof Tarea = {
            id,
            actividad,
        };

        //^Insertando los datos del Record a Map
        tareas.insert(tarea.id, tarea,);

        return tarea;
    }),

    //Muestrar todos las tareas
    muestraTareas: query([], Vec(Tarea), () =>{
        return tareas.values();
    }),

    // Elimina una tarea
    eliminarTarea: update([Principal], Tarea, (id) =>{
        const tareaOpt = tareas.get(id);
        const tarea = tareaOpt.Some;

        if('None' in tareaOpt){
            return Err({
                tareaNoExiste :id
            })
        }

        tareas.remove(tarea.id);

        return tarea;
        
    }),

    });

//? Función para generar la ID de forma aleatoria
function generarID(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}

