import app from './app';
import { connectDatabase } from './config/database';
import { empleadoService } from './services/empleado.service';

const port = Number(process.env.PORT || 3000);

connectDatabase()
  .then(() => empleadoService.initialize())
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error('❌ No se pudo iniciar la aplicación:', error);
    process.exit(1);
  });