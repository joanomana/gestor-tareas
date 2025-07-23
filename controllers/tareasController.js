import inquirer from 'inquirer';
import { obtenerTareas, guardarTareas } from './db.js';

export async function agregarTarea() {
  const tareas = obtenerTareas();

  const { descripcion } = await inquirer.prompt([
    { type: 'input', name: 'descripcion', message: 'Descripción de la tarea:' }
  ]);

  tareas.push({
    id: Date.now(),
    descripcion: descripcion.trim(),
    completada: false
  });

  guardarTareas(tareas);
  console.log('✅ Tarea agregada.');
}

export function listarTareas() {
  const tareas = obtenerTareas();

  if (tareas.length === 0) return console.log('📭 No hay tareas registradas.');

  console.log('\n📋 Lista de tareas:');
  tareas.forEach((t, i) => {
    const estado = t.completada ? '✅' : '❌';
    console.log(`${i + 1}. [${estado}] ${t.descripcion}`);
  });
}

export async function editarTarea() {
  const tareas = obtenerTareas();
  if (tareas.length === 0) return console.log('⚠️ No hay tareas para editar.');

  const { indice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'indice',
      message: 'Selecciona una tarea para editar:',
      choices: tareas.map((t, i) => ({
        name: t.descripcion,
        value: i
      }))
    }
  ]);

  const { nuevaDescripcion } = await inquirer.prompt([
    { type: 'input', name: 'nuevaDescripcion', message: 'Nueva descripción:' }
  ]);

  tareas[indice].descripcion = nuevaDescripcion.trim();
  guardarTareas(tareas);
  console.log('✏️ Tarea actualizada.');
}

export async function eliminarTarea() {
  const tareas = obtenerTareas();
  if (tareas.length === 0) return console.log('⚠️ No hay tareas para eliminar.');

  const { indice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'indice',
      message: 'Selecciona una tarea para eliminar:',
      choices: tareas.map((t, i) => ({
        name: t.descripcion,
        value: i
      }))
    }
  ]);

  tareas.splice(indice, 1);
  guardarTareas(tareas);
  console.log('🗑️ Tarea eliminada.');
}
