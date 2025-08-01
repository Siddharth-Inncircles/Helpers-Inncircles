import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database';
import helperRouter from './routes/helper.routes';
// dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());
app.use(helmet());

connectDB();

app.use('/api/helper', helperRouter);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
})


app.listen(PORT, ()=>{
  console.log(`Server is running on port: ${PORT}`);
})