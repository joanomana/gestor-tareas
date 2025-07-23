import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ruta = path.resolve(__dirname, '../data/tareas.json');

export function obtenerTareas() {
    try {
        const data = fs.readFileSync(ruta, 'utf-8');
        return JSON.parse(data);
    } catch {
        return []; // Si no existe o está vacío
    }
}

export function guardarTareas(tareas) {
    fs.mkdirSync(path.dirname(ruta), { recursive: true });
    fs.writeFileSync(ruta, JSON.stringify(tareas, null, 2), 'utf-8');
}
