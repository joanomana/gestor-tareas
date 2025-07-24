import inquirer from 'inquirer';

export default async function mostrarMenu() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: 'Selecciona una opción:',
      choices: [
        { name: '1. Agregar tarea', value: '1' },
        { name: '2. Listar tareas', value: '2' },
        { name: '3. Listar tareas por estado', value: '3' },
        { name: '4. Editar tarea', value: '4' },
        { name: '5. Modificar estado de tarea', value: '5' },
        { name: '6. Eliminar tarea', value: '6' },
        { name: '7. Buscar tareas', value: '7' },
        { name: '8. Salir', value: '8' }
      ]
    }
  ]);
  return opcion;
}