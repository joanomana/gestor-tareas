import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables del archivo .env

const MONGO_URI = process.env.MONGO_URI+'Tareas'; 
if (!MONGO_URI) throw new Error('No se encontro la variable MONGO_URI');

await mongoose.connect(MONGO_URI); 

// Esquema de la colección "tareas"
const tareaSchema = new mongoose.Schema({
    descripcion: { type: String, required: true, unique: true },
    completada: { type: Boolean, default: false }
});

export const Tarea = mongoose.model('Tarea', tareaSchema); 

// Métodos para interactuar con la base de datos
export async function obtenerTareas() {
    return await Tarea.find().lean(); // Devuelve todas las tareas como objetos planos
}

export async function guardarTareas(tarea) {
    const nueva = new Tarea(tarea);
    return await nueva.save();
}

export async function actualizarTarea(id, cambios) {
    return await Tarea.findByIdAndUpdate(id, cambios, { new: true }); // new:true devuelve la tarea actualizada
}

export async function eliminarTarea(id) {
    return await Tarea.findByIdAndDelete(id);
}

export async function buscarTareasPorDescripcion(termino) {
    return await Tarea.find({ descripcion: { $regex: termino, $options: 'i' } }).lean(); // Búsqueda insensible a mayúsculas
}
