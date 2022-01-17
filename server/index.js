const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

//middleware
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

//PORT
const PORT = process.env.PORT || 5000

//Connecton DB
mongoose.connect("mongodb+srv://user:pass123@cluster0.zqnv9.mongodb.net/login?retryWrites=true&w=majority")
.then(() => {
    console.log('Connection to the DB was Successful!')
}).catch((error) => {
    console.log(error)
})


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

//Schema
const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/register", (req, res)=> {
    const { name, email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 

app.listen(PORT, () => console.log(`App is listening on http://localhost:${ PORT }`))
