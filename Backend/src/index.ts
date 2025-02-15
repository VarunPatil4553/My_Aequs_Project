import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import Admin from './Controller/Admin';
import Employee from './Controller/Employee';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI!);
    if (db) {
      console.log('Database connected');
      app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
      });
    }
  } catch (err) {
    console.log(err);
  }
};

server();

app.use('/admin', Admin);
app.use('/employee', Employee);

export default app;
