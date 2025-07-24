import mostrarMenu from './utils/menu.js';
import {
  listarTareas,
  agregarTarea,
  editarTarea,
  eliminarTareaController,
  modificarEstadoTarea,
  listarTareasAgrupadas,
  buscarTareas
} from './controllers/tareasController.js';
import mongoose from 'mongoose';
import inquirer from 'inquirer';
import chalk from 'chalk';

async function main() {
  let salir = false;

  console.clear();
  console.log(chalk.green.bold('📌 Bienvenido a tu gestor de tareas\n'));

  while (!salir) {
    const opcion = await mostrarMenu();
    console.clear(); 

    switch (opcion) {
      case '1':
        await agregarTarea();
        break;
      case '2':
        await listarTareas();
        break;
      case '3':
        await listarTareasAgrupadas();
        break;
      case '4':
        await editarTarea();
        break;
      case '5':
        await modificarEstadoTarea();
        break;
      case '6':
        await eliminarTareaController();
        break;
      case '7':
        await buscarTareas();
        break;
      case '8':
        salir = true;
        console.log('\n👋 ' + chalk.blueBright('¡Hasta pronto!\n'));
        await mongoose.disconnect(); // Cierra conexión a la base de datos
        break;
    }

    if (!salir) {
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.gray('Presiona ENTER para continuar...')
        }
      ]);
      console.clear();
    }
  }
}

main();
