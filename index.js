import mostrarMenu from './utils/menu.js';
import { listarTareas, agregarTarea, editarTarea, eliminarTarea, modificarEstadoTarea, listarTareasAgrupadas,buscarTareas} from './controllers/tareasController.js';

async function main() {
  let salir = false;

  while (!salir) {
    const opcion = await mostrarMenu();

    switch (opcion) {
      case '1':
        await agregarTarea();
        break;
      case '2':
        listarTareas();
        break;
      case '3':
        listarTareasAgrupadas();
        break;
      case '4':
        await editarTarea();
        break;
      case '5':
        await modificarEstadoTarea();
        break;
      case '6':
        await eliminarTarea();
        break;
      case '7':
        await buscarTareas();
        break;
      case '8':
        salir = true;
        console.log('👋 ¡Hasta pronto!');
        break;
    }
  }
}

main();