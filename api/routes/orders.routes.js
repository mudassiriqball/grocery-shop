const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders.controller');

router.post("/deliver/order/id/delivery-boy/pick-order", OrdersController.add);
router.post("/deliver/order-deliver/delivery-boy/deliver-order/to-customer", OrdersController.dropOrder);

// get Requests
router.get("/single/order/by/id/search/:_id", OrdersController.get_order_by_id);
router.get("/single/order/by/code/delivery/pick/order/search/progress/:_code", OrdersController.get_order_by_code);
router.get("/admin/all/search/query/page/limit/:_status", OrdersController.get_order_query_search);


// post Requests
router.post("/place/order/id/user-order/:_id", OrdersController.place_order);

// get Requests
router.get("/admin/all/page/limit/orders/:_status", OrdersController.get_admin_orders_page_limit_by_status);
router.get("/customer/page/limit/orders/by-status/:_id", OrdersController.get_customer_orders_page_limit_by_id);
router.get("/delivery/boy/page/limit/orders/by-status/:_id", OrdersController.get_delivery_boy_orders);

// put Requests
router.put("/admin/id/update/order-status/:_id", OrdersController.updateStatus);
// delete Requests
// router.delete("/user/:_id", checkAuth, OrdersController.deleteUser);

module.exports = router;