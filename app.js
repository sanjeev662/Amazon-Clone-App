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

app.listen(port,()=>{
    console.log(`server is running on port number ${port}`);
})
   
DefaultData();