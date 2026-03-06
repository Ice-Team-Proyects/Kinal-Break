import dotenv from 'dotenv';
import { initServer } from './config/app.js';
import { deleteFileOnError } from "./middlewares/delete-file-on-error.js";

dotenv.config();

initServer();

// El servidor se inicializa dentro de initServer. Aquí no tenemos acceso a la
// variable `app` porque se crea en la función. Cualquier middleware global se
// debe registrar dentro de `config/app.js`.
// app.use(deleteFileOnError); // ❌ eliminado
