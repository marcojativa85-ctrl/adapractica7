import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import empleadosRoutes from './routes/empleados.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.set('puerto', process.env.PORT || 3000);
app.set('nombreApp', 'Gestión de empleados');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use('/api/v1', empleadosRoutes);
app.use(errorMiddleware);

export default app;