import express from 'express'
import { isAdmin, requireSignIn } from '../middleware/authmiddleware.js';
import { GetCategoryController, GetoneCategoryController, createCategoryController, deleteCategoryController, updateCategoryController,singleCategoryController } from '../controllers/CategoryController.js';

const router= express.Router()

//routes
//updation route
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);
router.post('/create-category',requireSignIn,isAdmin,createCategoryController)
router.get('/get-category',GetCategoryController);
router.get('/getone-category/:id',GetoneCategoryController);
//single category
router.get("/single-category/:slug", singleCategoryController);
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)
export default router;