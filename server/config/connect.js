import mongoose from 'mongoose';
 

 const connectDb=async(MONGO_URI)=>{
try{
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully✅");
}catch(error){
    console.log("Error connecting to database",error);
}


}

export default connectDb;