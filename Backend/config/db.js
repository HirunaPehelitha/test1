import mongoose from "mongoose";

export const connectDB =async()=>{
    await mongoose.connect('mongodb+srv://greenhub:232511822003@cluster0.c7fyf.mongodb.net/marketplace').then(()=>console.log("DB Connected"));
}