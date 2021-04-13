const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const sliderController = require('../controllers/sliders.controller');

// post Requests
router.post("/add-new/slider", sliderController.add_slider);

// get Requests
router.get("/all/sliders-list", sliderController.get_slider);

// put Requests
router.put("/slider/:_id", checkAuth, sliderController.update_slider);

// delete Requests
router.delete("/slider/id/remove/by-id/:_id", sliderController.delete_slider);

module.exports = router;