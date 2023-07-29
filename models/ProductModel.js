import mongoose from 'mongoose';
const ProductSchema= new mongoose.Schema({
     name:{
        type:String,
        required:true,
     },
     slug:{
        type:String,
        required:true,
     },
     description:{
        type:String,
        required:true,
     },
     price:{
        type:Number,
        required:true,
     },
     category:{
        /*This defines a field called category with a type of mongoose.ObjectId, which is a special type that represents the unique identifier of a document in another collection. In this case, the Category collection. This field will store the category that the product belongs to.*/
        type:mongoose.ObjectId,
        ref:'Category',
        required:true,
     },
     quantity:{
        type:Number,
        required:true,
     },
     photo:{
        Data:Buffer,
        contentType:String
     },
     shipping:{
        type:Boolean,
     }
},{timestamps:true})
export default mongoose.model('Products',ProductSchema);