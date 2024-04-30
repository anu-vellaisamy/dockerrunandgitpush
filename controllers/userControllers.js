const { count } = require('console');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { status } = require('express/lib/response');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const { message } = require('statuses');

const register =  async(req, res)=>{

 const userData = req.body;

 User.findOne({email: req.body.email})
 .then((userExist)=>{
    if(userExist){
       res.json({status: 400, message: "user already exist"})
    }else{
        const hash = bcrypt.hash(userData.password, 10)
        .then((hash)=>{
       User.create({ name : req.body.name, email : req.body.email, password: hash})
            .then((result)=>{
                console.log(result);
            //    const jwt_secret = jwt.sign(result._id, process.env.jwt_secretKey, {expiresIn: "3d"});
                return res.json({message: "User registered successfully", data : result})
              })
    
        }) 
    }
 }).catch((err)=>{
    res.send({message: "Api has some issue "+ err.message});
 })
};

const login = async(req, res)=>{
  User.findOne({email: req.body.email})
  .then((emailCheck)=>{
    if(!emailCheck){
        return res.json({status: 400, message: "user not avilable please register"})
    }else{
        bcrypt.compare(req.body.password, emailCheck.password, (err, data)=>{
            if(err){
                res.json({status: 400, message: `${err}`})
            }else{
                const jwt_token = jwt.sign({email: req.body.email}, process.env.jwt_secretKey, {expiresIn: '3d'})
                res.header('auth_token', jwt_token);
                res.json({message: "Loggin sucesfully", token: jwt_token});
            }
        })
    }
  }).catch((er)=>{
    res.json({message: `${er}`})
  })
}

const verifyUser = async(req, res, next)=>{
    const token = req.header('auth_token');
    req.token = token;
    next();
}

const getAllData = async(req, res)=>{
    jwt.verify(req.token, process.env.jwt_secretKey, async(err, data)=>{
        if(err){
            res.json({message: "User not verified"});
        }else{
            const allData =  await User.find({});
            res.json({message: "User data", count: allData.length, data: allData})
        }
    })
}

const updatedate = async(req, res)=>{
    const dataOfUser = req.body;
    jwt.verify(req.token, process.env.jwt_secretKey, async(err, data)=>{
        if(err){
            res.json({message: `${err}`})
        }else{
            const userData = await User.findByIdAndUpdate(dataOfUser.id, req.body);
             if(!userData){
             res.json({message: "User not matched with id"})
             }else{
                const findUpdatedData = await User.findById(userData.id)
                res.json({message: "User updated successfully", Data: findUpdatedData})
             }
        }
    })
}

const editData = async(req, res)=>{
    //const userData = req.body;
    jwt.verify(req.token, process.env.jwt_secretKey, async(err, data)=>{
        if(err){
            res.json({message: "User not identified"})
        }else{
            const getDataById = await User.findById({id});
            res.json({message: "Get data based on Id", Data: getDataById})
        }
    })
}

const deleteData = async(req, res)=>{
    jwt.verify(req.token, process.env.jwt_secretKey, async(err, data)=>{
        if(err){
            res.json({status: 400, message: "User not found"})
        }else{
            const deleteData = await User.findByIdAndDelete(req.body.id);
            res.json({message: "User deleted sucessfully", DeletedData: req.body.id})
        }
    })
}


module.exports = { register, login, getAllData, updatedate, editData, deleteData, verifyUser}