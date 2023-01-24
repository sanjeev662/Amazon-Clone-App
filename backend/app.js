require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
require("./db/conn");
const cookieParser = require("cookie-parser");

const Products = require ("./models/productsSchema");
const DefaultData = require ("./defaultdata");
const cors=require("cors");
const router=require("./routes/router");

app.use(express.json());
app.use(cookieParser(""));
app.use(cors());

//for using router api we use, use methode..
// app.use("/db",router);

app.use(router);

const port = process.env.PORT || 8005;

//////////////////////////////////Deployment///////////////////////////////////////////


//for deploying our react app ...it allow when we in production environment,
//then run an express middleware that gives the server access to our react app.
//by which our react app deployed as html file.
//ak tarah se backend ko frontend se jodne ke liye in production environment..use ho rha hai

if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"))
}
else {
    app.get("/", (req, res) => {
      res.send("API is running..");
    });
  }


////////////////////////////Deployment over////////////////////////////////////////////////



app.listen(port,()=>{
    console.log(`server is running on port number ${port}`);
})
   
DefaultData();