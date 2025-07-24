import inquirer from 'inquirer';
import _ from 'lodash';
import chalk from 'chalk';
import {
  obtenerTareas,
  guardarTareas,
  actualizarTarea,
  eliminarTarea,
  buscarTareasPorDescripcion
} from '../data/db.js';

export async function agregarTarea()  {
  console.log();
  const tareas = await obtenerTareas();

  const { descripcion } = await inquirer.prompt([
    {
      type: 'input',
      name: 'descripcion',
      message: 'Descripción de la tarea:',
      validate: input => {
        const desc = _.trim(input);
        if (_.isEmpty(desc)) return '⚠️ La descripción no puede estar vacía.';
        if (_.some(tareas, { descripcion: desc })) return '⚠️ Ya existe una tarea con esa descripción.';
        return true;
      }
    }
  ]);

  await guardarTareas({
    descripcion: _.trim(descripcion),
    completada: false
  });

  console.log(chalk.green('✅ Tarea agregada.\n'));
}

export async function listarTareas() {
  console.log();
  const tareas = await obtenerTareas();

  if (_.isEmpty(tareas)) return console.log('📭 No hay tareas registradas.');

  const tareasOrdenadas = _.orderBy(tareas, ['completada', 'descripcion'], ['asc', 'asc']);

  console.log(chalk.blue('\n📋 Lista de tareas:'));
  tareasOrdenadas.forEach((t, i) => {
    const estado = t.completada ? '✅' : '❌';
    console.log(`${i + 1}. [${estado}] ${chalk.white(t.descripcion)}`);
  });
  console.log();
}

export async function listarTareasAgrupadas() {
  console.log();
  const tareas = await obtenerTareas();

  if (_.isEmpty(tareas)) return console.log('📭 No hay tareas registradas.');

  const agrupadas = _.groupBy(tareas, t => t.completada ? 'Completadas' : 'Pendientes');

  console.log(chalk.blue('\n📋 Tareas agrupadas:'));

  Object.entries(agrupadas).forEach(([estado, lista]) => {
    console.log(`\n🔹 ${estado}:`);
    lista.forEach((t, i) => {
      console.log(`   ${i + 1}. ${chalk.white(t.descripcion)} ${t.completada ? '✅' : '❌'}`);
    });
    console.log();
  });
}

export async function buscarTareas() {
  console.log();
  const { termino } = await inquirer.prompt([
    {
      type: 'input',
      name: 'termino',
      message: 'Buscar tareas que contengan:',
      validate: input => _.isEmpty(_.trim(input)) ? 'Ingresa un término válido.' : true
    }
  ]);

  const resultado = await buscarTareasPorDescripcion(termino);

  if (_.isEmpty(resultado)) {
    console.log(chalk.yellow('🔍 No se encontraron coincidencias.'));
  } else {
    console.log(chalk.cyan('\n🔍 Resultados de la búsqueda:'));
    resultado.forEach((t, i) => {
      const estado = t.completada ? '✅' : '❌';
      console.log(`${i + 1}. [${estado}] ${chalk.white(t.descripcion)}`);
    });
  }
}

export async function editarTarea() {
  console.log();
  const tareas = await obtenerTareas();
  if (_.isEmpty(tareas)) return console.log('⚠️ No hay tareas para editar.');

  const { id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Selecciona una tarea para editar:',
      choices: tareas.map(t => ({ name: t.descripcion, value: t._id }))
    }
  ]);

  const { nuevaDescripcion } = await inquirer.prompt([
    { type: 'input', name: 'nuevaDescripcion', message: 'Nueva descripción:' }
  ]);

  await actualizarTarea(id, { descripcion: _.trim(nuevaDescripcion) });

  console.log(chalk.cyan('✏️ Tarea actualizada.'));
}

export async function eliminarTareaController() {
  console.log();
  const tareas = await obtenerTareas();
  if (_.isEmpty(tareas)) return console.log(chalk.yellow('⚠️ No hay tareas para eliminar.'));

  const { id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Selecciona una tarea para eliminar:',
      choices: tareas.map(t => ({ name: t.descripcion, value: t._id }))
    }
  ]);

  await eliminarTarea(id);

  console.log(chalk.red('🗑️ Tarea eliminada.'));
}

export async function modificarEstadoTarea() {
  console.log();
  const tareas = await obtenerTareas();
  console.log(typeof tareas);
  if (_.isEmpty(tareas)) return console.log(chalk.yellow('⚠️ No hay tareas para modificar.'));

  const { id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'id',
      message: 'Selecciona una tarea para cambiar su estado:',
      choices: tareas.map(t => ({ name: t.descripcion, value: t._id.toString() }))
    }
  ]);

  const tareaSeleccionada = tareas.find(t => t._id.toString() === id);
  const { estado } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'estado',
      message: `¿Marcar la tarea "${tareaSeleccionada.descripcion}" como completada?`,
      default: tareaSeleccionada.completada
    }
  ]);

  await actualizarTarea(id, { completada: estado });

  console.log(chalk.green(`✅ Estado de la tarea "${tareaSeleccionada.descripcion}" modificado a ${estado ? 'completada' : 'pendiente'}.`));
}
