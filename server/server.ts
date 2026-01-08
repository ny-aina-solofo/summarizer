import express from "express";
import cors from "cors";
import routes from "./src/routes/routes";  
import dotenv from 'dotenv';
import db from './src/models/sequelizeModel';

dotenv.config();
const app = express();
const urlAPI = process.env.URL_API; 
const portAPI = process.env.PORT; 
const corsOptions = {origin : urlAPI};
const baseUrl = process.env.BASE_URL || "/summarizer-api" 

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(baseUrl,routes);
app.listen(portAPI, ()=>{
    console.log(`app run on port ${portAPI}`);
})


db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((error) => {
    console.log("Failed to sync db: " + error.message);
  }); 
// db.sequelize.sync({force : true}).then(()=>{console.log("Drop and re-sync db.");})

