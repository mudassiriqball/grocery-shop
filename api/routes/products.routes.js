const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/products.controller');

// post Requests 
router.post("/add-new/product/:_id", productController.addProduct);
//router.post("/bulk_upload", productController.bulkupload);

// get Requests
router.get("/all-products", productController.get_all_products);
router.get("/admin-products-query-search", productController.get_admin_products);
router.get("/inventory/page/limit/all/products", productController.get_admin_inventory);
router.get("/page/limit/category/sub-category", productController.get_products_by_category);

router.get("/product/id/product-by-id/:_id", productController.get_product_by_id);
router.get("/any/product-by-id/:_id", productController.get_all_product_by_id);

router.get("/abc/cde/vendor/user-products/:_id", productController.get_vendor_products);
router.get("/user-products-query-search/:_id", productController.get_vendor_product_query_search);

router.get("/products-all-count/:_id", productController.geteverything);
router.get("/search/products/query-only", productController.get_search_products);

router.get("/less-stock/:_id", productController.get_less_stock_products);
router.get("/vendor-search-less-stock/:_id", productController.get_vendor_product_less_stock_by_id);
router.get("/inventory/admin/search/all/products", productController.get_search_all_product);

router.put("/add/review/rating/:_id", checkAuth, productController.add_rating_and_review);
// put Requests
router.put("/delete-product/:_id", checkAuth, productController.deleteProduct);

router.put("/update/product/by-id/admin/inventory/:_id", checkAuth, productController.update_product_data);
router.put("/delete/put/isdeleted-true/product/by-id/admin/inventory/:_id", checkAuth, productController.delete_product);

router.put("/product/update/product-variation/:_id", checkAuth, productController.update_product_variation_data);
module.exports = router;