import inquirer from 'inquirer';
import { obtenerTareas, guardarTareas } from './db.js';
import _ from 'lodash';
import chalk from 'chalk';


export async function agregarTarea() {
  console.log();
  const tareas = obtenerTareas();

  const { descripcion } = await inquirer.prompt([
    { type: 'input', name: 'descripcion', message: 'Descripción de la tarea:', validate: function(input) {
      if (_.isEmpty(_.trim(input))) {
        return '⚠️ La descripción no puede estar vacía.';
      }else if (_.some(tareas, { descripcion: _.trim(input) })) {
        return '⚠️ Ya existe una tarea con esa descripción.';
      }
      return true;
    }}
  ]);

  tareas.push({
    id: _.uniqueId('tarea_'),
    descripcion: _.trim(descripcion),
    completada: false
  });

  const tareasUnicas = _.uniqBy(tareas, 'descripcion');

  guardarTareas(tareasUnicas);
  console.log(chalk.green('✅ Tarea agregada.'));
  console.log();
}

export function listarTareas() {
  console.log();
  const tareas = obtenerTareas();

  if (_.isEmpty(tareas)) return console.log('📭 No hay tareas registradas.');

  const tareasOrdenadas = _.orderBy(tareas, ['completada', 'descripcion'], ['asc', 'asc']);

  console.log(chalk.blue('\n📋 Lista de tareas:'));
  console.log();
  tareasOrdenadas.forEach((t, i) => {
    const estado = t.completada ? '✅' : '❌';
    console.log(`${i + 1}. [${estado}] ${chalk.white(t.descripcion)}`);
  });
  console.log();
}

export function listarTareasAgrupadas() {
  console.log();
  const tareas = obtenerTareas();

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
  const tareas = obtenerTareas();
  if (_.isEmpty(tareas)) return console.log('📭 No hay tareas registradas.');

  const { termino } = await inquirer.prompt([
    {
      type: 'input',
      name: 'termino',
      message: 'Buscar tareas que contengan:',
      validate: input => _.isEmpty(_.trim(input)) ? 'Ingresa un término válido.' : true
    }
  ]);

  const resultado = _.filter(tareas, t => _.includes(_.toLower(t.descripcion), _.toLower(termino)));

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
  console.log(chalk.cyan('✏️ Tarea actualizada.'));
}

export async function eliminarTarea() {
  console.log();
  const tareas = obtenerTareas();
  if (tareas.length === 0) return console.log(chalk.yellow('⚠️ No hay tareas para eliminar.'));

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
  console.log(chalk.red('🗑️ Tarea eliminada.'));
}

export async function modificarEstadoTarea() {
  console.log();
  const tareas = obtenerTareas();
  if (tareas.length === 0) return console.log(chalk.yellow('⚠️ No hay tareas para modificar.'));

  const { indice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'indice',
      message: 'Selecciona una tarea para modificar su estado:',
      choices: tareas.map((t, i) => ({
        name: t.descripcion,
        value: i
      }))
    }
  ]);
  const {estado} = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'estado',
      message: `¿Marcar la tarea "${tareas[indice].descripcion}" como completada?`,
      default: tareas[indice].completada
    }
  ]);

  tareas[indice].completada = estado;
  guardarTareas(tareas);
  console.log(chalk.green(`✅ Estado de la tarea "${tareas[indice].descripcion}" modificado a ${tareas[indice].completada ? 'completada' : 'pendiente'}.`));
}