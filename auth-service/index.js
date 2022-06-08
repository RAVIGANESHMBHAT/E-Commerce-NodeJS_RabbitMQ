const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const User = require("./models/User")

const app = express()
const port = process.env.PORT_ONE || 7070

mongoose.connect("mongodb+srv://raviganeshm:Computer2%40@cluster0.fvf2b.mongodb.net/auth-service?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log(`Auth-Service Db connected.`)
})

app.use(express.json())

app.post("/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        return res.status(500).json({message: "User already exists."})
    } else {
        const newUser = new User({
            name,
            email,
            password
        })
        newUser.save();
        res.status(201).json(newUser)
    }
})

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ message: "User doesn't exist" })
    } else {
        //Check if the entered password is valid
        if (password !== user.password) {
            return res.json({ message: "Password is incorrect" })
        }
        const payload = {
            email,
            name: user.name
        }
        jwt.sign(payload, "secret", (err, token) => {
            if (err) {
                console.log(err)
            } else {
                return res.json({ token: token })
            }
        })
    }
})

app.listen(port, () => {
    console.log(`Auth-Service running at port ${port}`)
})