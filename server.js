const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const cors = require('cors');
const { json } = require('body-parser');

const userRouter = require('./routers/userRouters');

const app = express();


app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    limit: "50mb"}))
app.use(cors());
app.use(morgan('tiny'));


const PORT = process.env.PORT;

//All api routers
app.use('/api/user', userRouter)

//simple api
app.get('/chatget', (req, res)=>{
    res.json("APi is working fine")
})


mongoose.connect(process.env.MONGO);
mongoose.connection.on("error", (err)=>{
    console.log("Mongoose Connection Error: "+ err.message);
})
mongoose.connection.once("open", ()=>{
    console.log("MongoDb Connected");
})

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})





