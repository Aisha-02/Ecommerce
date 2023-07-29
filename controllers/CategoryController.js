import CategoryModel from "../models/CategoryModel.js";
import slugify from 'slugify'
export const createCategoryController=async(req,res)=>{
    try {
        const {name}=req.body;
        if(!name)
        {
            return res.status(401).send({
                success:false,
                message:'Name is Required'
            })
        }
        const existing= await CategoryModel.findOne({name});
        if(existing)
        {
            return res.status(200).send({
                success:false,
                message:'Category Already Exisits'
            })
        }
        const category= await new CategoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:'Category Created Successfully',
            category
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in CategoryController",
            error,
        })
    };

};
//updateCategoryController

export const updateCategoryController= async(req,res)=>{
  try {
       const {name}=req.body;
       const { id }= req.params;
       const category=await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
       res.status(200).send({
        success:true,
        message:'Category Updated Successfully',
        category
       })
  } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error in Controller',
        error
    })
  }
};
//GetCategoryController
export const GetCategoryController = async (req, res) => {
    try {
      const category = await CategoryModel.find({});
      res.status(200).send({
        success: true,
        message: "All Categories List",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting all categories",
      });
    }
  };
   
//GetoneCategoryController
export const GetoneCategoryController=async(req,res)=>{
    try {
    const {id} =req.params;
     const category= await CategoryModel.findById(id);
     res.status(200).send({
         success:true,
         message:'Category Found',
         category,
     
    });
 }
    catch (error) {
     console.log(error);
     res.status(500).send({
         success:false,
         message:'Error in Controller',
         error
     })
    }
 };
 // single category
export const singleCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};
 //deleteCategoryController
 export const deleteCategoryController=async(req,res)=>{
    try {
    const {id} =req.params;
     const category= await CategoryModel.findByIdAndDelete(id);
     res.status(200).send({
         success:true,
         message:'Category Deleted Successfully',
     
    });
 }
    catch (error) {
     console.log(error);
     res.status(500).send({
         success:false,
         message:'Error in Controller',
         error
     })
    }
 };