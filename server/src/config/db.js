const mongoose=require('mongoose')

// connection function
const connectDb=async()=>{
    try{
        const conn=await mongoose.connect(process.env.mongodb_url)
        console.log(`✅ MongoDB successfullly connected`)
    }catch(err){
         console.error('❌ MongoDB connection failed:',err.message)
         process.exit(1);
    }
}
module.exports=connectDb