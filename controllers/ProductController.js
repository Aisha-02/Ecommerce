import slugify from "slugify";
import ProductModel from "../models/ProductModel.js";
import categoryModel from "../models/CategoryModel.js"
import orderModel from "../models/orderModel.js";
import fs from 'fs'
import braintree from 'braintree';
import dotenv from "dotenv";
dotenv.config();
//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const CreateProductController=async(req,res)=>{
  try {
    const {name,slug,description,price,category,quantity,shipping}=req.fields
    const {photo} = req.files
    switch(true){
      case !name:
        return res.status(500).send({error:'Name is Required'})
      case !description:
        return res.status(500).send({error:'Description is Required'})
      case !price:
        return res.status(500).send({error:'Price is Required'})
      case !category:
        return res.status(500).send({error:'Category is Required'})
      case !quantity:
        return res.status(500).send({error:'Quantity is Required'})
      case photo && photo.size>100000 :
        return res.status(500).send({error:'Photo is Required and should be less then 1MB'})
      
      } 
      const products= new ProductModel({...req.fields,slug:slugify(name)})
      if(photo){
        products.photo.Data=fs.readFileSync(photo.path);
        products.photo.contentType=photo.type
      }
      await products.save();
      res.status(201).send({
        success:true,
        message:'Product Created Successfully',
        products,
      })
    }
  catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'error in controller',
        error,
    })
  }
};

export const getProductController=async(req,res)=>{
  try {
    const products= await  ProductModel.find({}).select("-photo").populate('category').limit(12).sort({createdAt:-1});
    res.status(200).send({
      success:true,
      message:'got Products Successfully',
      products,
      total:products.length,
    })
  } catch (error) 
  {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error in Getting Products",
      error,
    })
    
  }
};


//getoneProductController
export const getoneProductController=async(req,res)=>{
   try {
    const {slug} = req.params;
    const product = await ProductModel.findOne({slug}).select('-photo').populate('category');
    res.status(200).send({
      success:true,
      message:'got Product',
      product,
    })
    
   } catch (error) 
   {
    console.log(error);
     res.status(500).send({
         success:false,
         message:'Error in Controller',
         error
     })
   }
}

//getPhotoProductController
export const getPhotoProductController=async(req,res)=>{
  try {
    const {pid}=req.params;
    const product = await ProductModel.findById(pid).select('photo');
    if(product.photo.Data){
    res.set('Content-type',product.photo.contentType);
    res.status(200).send(product.photo.Data);
  }
  } catch (error) {
    console.log(error);
     res.status(500).send({
         success:false,
         message:'Error in Controller',
         error
     })
  }
}

//deleteProductController
export const deleteProductController=async(req,res)=>{
  try {
    const {id}=req.params;
    await ProductModel.findByIdAndDelete(id).select('-photo');
    res.status(200).send({
      success:true,
      message:'Product deleted Successfully',
    })
    
  } catch (error) {
    console.log(error);
     res.status(500).send({
         success:false,
         message:'Error in Controller',
         error
     })
  }
}

//updateProductController
export const updateProductController=async(req,res)=>{
  try {
    const {name,slug,description,price,category,quantity,shipping}=req.fields
    const {photo} = req.files
    switch(true){
      case !name:
        return res.status(500).send({error:'Name is Required'})
      case !description:
        return res.status(500).send({error:'Description is Required'})
      case !price:
        return res.status(500).send({error:'Price is Required'})
      case !category:
        return res.status(500).send({error:'Category is Required'})
      case !quantity:
        return res.status(500).send({error:'Quantity is Required'})
      case photo && photo.size>100000 :
        return res.status(500).send({error:'Photo is Required and should be less then 1MB'})
      
      } 
      const products= await ProductModel.findByIdAndUpdate(req.params.id,{...req.fields,slug:slugify(name)},{new:true})
      if(photo)
      {
        products.photo.Data=fs.readFileSync(photo.path);
        products.photo.contentType=photo.type
      }
      await products.save();
      res.status(201).send({
        success:true,
        message:'Product Created Successfully',
        products,
      })
    }
  catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'error in controller',
        error,
    })
  }
};

//productFiltersController
export const productFiltersController=async(req,res)=>{
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error,
    });
  }
}
// product count
export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};
// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await ProductModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await ProductModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};
//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};