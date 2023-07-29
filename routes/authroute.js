import express from "express";
import {forgotPasswordController,registerController,loginController,testController,updateProfileController,getAllOrdersController,getOrdersController,orderStatusController} from "../controllers/authcontroller.js";
import { isAdmin, requireSignIn } from "../middleware/authmiddleware.js";
//router object
const router= express.Router()

//routing
//register
router.post('/register',registerController);
//Login||Post
router.post('/login',loginController);
//forgot password ||post
router.post('/forgot-password',forgotPasswordController);
//test
router.get('/test',requireSignIn,isAdmin,testController);
//protected route
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});
//update profile
router.put("/profile", requireSignIn, updateProfileController);
//orders
router.get('/orders',requireSignIn,getOrdersController);
//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);



export default router