const express = require('express');
const app  = express()
const mongoose = require('mongoose')
const user = require('./MOCK_DATA.json');
const fs = require('fs');
const { type } = require('os');


mongoose.connect('mongodb://127.0.0.1:27017/dummyDb')
.then(()=>{ console.log("MoongoDb Connected")})
.catch((err)=>{console.log("MongoDb error")})

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    gender:{
        type: String,
    }
    
})

const User = mongoose.model('User', userSchema);

app.listen(3000, () =>{
    console.log("object listening on port 3000");
})


app.get('/users', (req,res)=>{
    return res.json(user)
})


app.use(express.urlencoded({extended: false}));

app.route('/api/users/:id')
.get((req,res)=>{
    const id = Number(req.params.id);
    const userData = user.find((data)=> data.id == id);
    return res.json(userData);
})
.patch((req,res)=>{
    res.json({message: "User Updated successfully"})
})
.delete((req,res)=>{
    res.json({message: "User Deleted successfully"})
})

app.post('/api/create/user', async (req,res)=>{
    const body = req.body;
    if (
        !body.firstName ||
        !body.lastName ||
        !body.email ||
        !body.gender
    ){
        return res.status(400).json({message: "All fields are required"})
    }
    const result = await User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        gender: body.gender,
    })

    return res.status(201).json({message: "User created successfully", data: result})
    
})




