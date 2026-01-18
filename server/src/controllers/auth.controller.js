import User from '../models/user.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

// register
export const register = async (req, res) => {

    try {
        const { name, email, password, phoneNumber } = req.body;

        // validation
        if (!name || !email || !password || !phoneNumber) return res.status(400).json({ message: "All fields are required" })

        // check if already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "User already exists" })

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({ name, email, phoneNumber, password: hashedPassword })

        return res.status(201).json({
            message: "User registered successfully", user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            }
        })
    }
    catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

// login 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        //    validate input 

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" })
        }

        //    find user
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // campare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // create JWT
        const token = jwt.sign(
            { id: user._id, email: user.email }, process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN })

        // send response
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            }
        })
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const dummy = async (req,res) => {
    res.json({ message: "Access granted"});
}