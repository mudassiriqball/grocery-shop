const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const categoriesController = require('../controllers/categories.controller');

// post Requests
router.post("/add/new/category-subcategory", categoriesController.add_Category);
router.post("/field", checkAuth, categoriesController.add_fields);
router.post("/field-request", checkAuth, categoriesController.add_field_request);
router.post("/home-category", categoriesController.add_unique_category);

// get Requests
router.get("/get-all/categories-subcategories", categoriesController.get_categories);
router.get("/fields", categoriesController.get_fields);
router.get("/field-requests", categoriesController.get_field_requests);
router.get("/tags", categoriesController.get_tags);
router.get("/home-categories", categoriesController.get_unique_category);

// Update Requests
router.put("/category/id/update/by-id/:_id", categoriesController.update_category);
router.put("/sub-category/update/by-id/:_id", categoriesController.update_sub_category);
router.put("/field/:_id", checkAuth, categoriesController.update_field);

//  Delete Requests
// router.delete("/sub-category/_id", categoriesController.delete_sub_category);
router.delete("/field/:_id", checkAuth, categoriesController.delete_field);
router.delete("/field-request/:_id", checkAuth, categoriesController.delete_field_request);
router.delete("/home-category/:_id", categoriesController.delete_unique_category);

module.exports = router;