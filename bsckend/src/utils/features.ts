import mongoose from "mongoose"

export const connectdb =()=>{
    mongoose.connect("mongodb://localhost:27017",{
        dbName: "Ecomerce24",

    }).then( c=>console.log(`db sonnected to ${c.connection.host}`))
    .catch(err => console.log(`db conection error :${err}`))
    
};