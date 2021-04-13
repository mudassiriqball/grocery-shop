const express = require("express");
const router = express.Router();
const UserController = require('../controllers/users.controller');
const checkAuth = require('../middleware/check-auth');

// post Requests
router.post("/auth/login-user", UserController.loginUser);
router.post("/auth/register/register-user", UserController.registerUser);

// router.post("/",UserController.addUser);

// get Requests
router.get("/all-users", UserController.getAll);
router.get("/get-user/id/user-by-id/:_id", UserController.get_user);
router.get("/auth/verify/mobile-number/:_mobile", UserController.check_mobile);
router.get("/admins", UserController.get_admins);
router.get("/new-vendors", UserController.get_new_vendors);
router.get("/vendors", UserController.get_vendors);
router.get("/restricted-vendors", UserController.get_restricted_vendors);
router.get("/customers", UserController.get_customers);
router.get("/restricted-customers", UserController.get_restricted_customers);
router.get("/cart/:_id", UserController.get_cart);
router.get("/all/user/count", UserController.get_total_specific_users);
router.get("/all-users/page/limit/by-status/:_role", UserController.get_user_by_role);
router.get("/all-users/search/by-status/:_role", UserController.get_users_by_query);
// router.get("/:_id",UserController.getSingleUser);

// put Requests
router.put("/user-avatar/:_id", checkAuth, UserController.set_avatar);
router.put("/status/id/customer-only/:_id", checkAuth, UserController.update_status);
router.put("/reset-password/:_id", UserController.reset_password);
router.put("/cart/id/add/:_id", checkAuth, UserController.add_to_cart);
router.put("/clear-cart-obj/id/clear-by-id/:_id", UserController.deleteCartData);
router.put("/profile/id/update-all/:_id", UserController.update_profile);
// router.put("/:_id", UserController.updateUser);

// delete Requests
router.delete("/discard/new-customer/by-id/:_id", checkAuth, UserController.deleteUser);
router.delete("/delete-cart/id/delete-cart-by-id/:_id", checkAuth, UserController.delete_cart);
module.exports = router;