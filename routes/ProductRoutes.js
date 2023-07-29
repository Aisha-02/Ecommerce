import express from 'express'
import { isAdmin, requireSignIn } from './../middleware/authmiddleware.js';
import { CreateProductController, deleteProductController, getPhotoProductController, getProductController, getoneProductController, updateProductController,productFiltersController,productListController,productCountController,searchProductController,realtedProductController,productCategoryController, braintreeTokenController, brainTreePaymentController } from '../controllers/ProductController.js';
import formidable from 'express-formidable'
const router=express.Router();

//routes
router.post('/create-product',requireSignIn,isAdmin,formidable(),CreateProductController);
router.get('/get-product',getProductController)
router.get('/getone-product/:slug',getoneProductController);
router.get('/product-photo/:pid',getPhotoProductController);
router.delete('/delete-product/:id',requireSignIn,isAdmin,deleteProductController);
router.put('/update-product/:id',requireSignIn,isAdmin,formidable(),updateProductController);
router.post('/product-filters',productFiltersController);
//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payment routes
//token
router.get('/braintree/tokan',braintreeTokenController);
router.post('/braintree/payment',requireSignIn,brainTreePaymentController);
export default router;