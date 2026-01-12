import express from "express";
import cors from "cors";
import routes from "./routes/routes";  
import dotenv from 'dotenv';
import db from './models/sequelizeModel';
import { errorHandler } from "./middlewares/errorHandler";
import config from "./config/config";

const app = express();
const urlAPI = config.urlAPI; 
const portAPI = config.port; 
const corsOptions = {origin : urlAPI};
const baseUrl = config.baseUrl 

app.use(cors(corsOptions));
app.use(express.json()); 

if (!baseUrl) {
  throw new Error("BASE_URL is not defined");
}

app.use(baseUrl,routes);
app.use(errorHandler);  // Global error handler (should be after routes)
app.listen(portAPI, ()=>{
    console.log(`app run on port ${portAPI}`);
})

if (config.nodeEnv === 'dev') {
    // db.sequelize.sync()
    //   .then(() => {
    //     console.log("Synced db.");
    //   })
    //   .catch((error) => {
    //     console.log("Failed to sync db: " + error.message);
    //   }); 
    // db.sequelize.sync({force : true}).then(()=>{console.log("Drop and re-sync db.");})
}

