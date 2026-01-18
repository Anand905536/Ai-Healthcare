import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import connectDb from './config/db.js'
import userRouter from './routes/user.route.js'
import reportRouter from './routes/report.route.js'


const app = express()


// route redirection
app.use(bodyParser.json())
app.use(cors());
app.use('/auth', userRouter);
app.use('/report',reportRouter)

// database connection
connectDb();

// server started
const PORT = process.env.PORT
app.listen(PORT, () => { console.log(`🚀 server is running on the port ${PORT} 🚀`) })
