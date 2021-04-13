const OrdersController = {};
// Stripe
const stripe = require("stripe")(
  "sk_test_51I4uMrHe2QzPDxzG9uiYxeMSyOSo2Q0PK9c1r30ZVt4IVNo5yGmv0873Go5XeLNGmyZMWoyTAd3fuzm3aRhtmWRc00UHyon6a1"
);
// const uuid = require("uuid/v4");
const { v4: uuidv4 } = require("uuid");
const Orders = require("../models/order.model");
const Product = require("../models/product.model");
const Delivery = require("../models/delivery.models");
const mongoose = require("mongoose");
const { ObjectID } = require('mongodb');


OrdersController.add = async (req, res) => {
  let order = await Orders.findOne({ _id: req.query.order_id }, { status: 1 });
  if (order.status === "pending") {
    const body = req.query;
    var datetime = new Date();
    body.entry_date = datetime;
    body.status = "progress";

    const delivery = new Delivery(body);
    const result = await delivery.save();

    const newObjectId = new ObjectID();
    console.log('object id', newObjectId);

    // const newObjectId = new ObjectID();
    // console.log(newObjectId);
    let update = await Orders.findOneAndUpdate(
      { _id: req.query.order_id },
      {
        $set: { status: "progress", code: newObjectId },
      }
    );
    res.status(200).send({
      code: 200,
      message: "order status is updated",
    });

  } else {
    res.status(201).send({
      code: 201,
      message: order.status,
    });
  }
};

OrdersController.dropOrder = async (req, res) => {
  try {
    let order = await Orders.findOne({ _id: req.query.order_id }, { status: 1 });
    if (order.status === "progress") {
      let order = await Delivery.findOne({
        delivery_boy_id: req.query.delivery_boy_id,
        order_id: req.query.order_id
      });
      if (order) {
        let update = await Orders.findOneAndUpdate(
          { _id: req.query.order_id },
          {
            $set: { status: "delivered" },
          }
        );
        let update1 = await Delivery.findOneAndUpdate(
          { order_id: req.query.order_id, delivery_boy_id: req.query.delivery_boy_id },
          {
            $set: { status: "delivered" },
          }
        );
        res.status(200).send({
          code: 200,
          message: 'Success'
        });
      } else {
        res.status(203).send({
          code: 203,
        });
      }
    } else {
      res.status(201).send({
        code: 201,
        message: order.status,
      });
    }
  } catch (err) {
    console.log("error", error);
    return res.status(500).send({
      message: 'Error',
      error: err
    });
  }
};

OrdersController.get_order_by_id = async (req, res) => {
  let order;
  try {
    order = await Orders.find({
      _id: req.params._id,
    });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: order,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

OrdersController.get_order_by_code = async (req, res) => {
  let order;
  var ObjectId = mongoose.Types.ObjectId;
  const _code = new ObjectId(req.params._code);
  try {
    order = await Orders.find({
      code: _code,
    });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: order,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

OrdersController.get_order_query_search = async (req, res) => {
  let order;
  const field = req.query.field;
  const search = {};
  search[field] = req.query.q;
  search["status"] = req.params._status;
  try {
    order = await Orders.paginate(search, {
      limit: parseInt(req.query.limit),
      page: parseInt(req.query.page),
    });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: order,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

OrdersController.place_order = async (req, res) => {
  let data = [];
  var found = false;
  var saveorder = false;
  var paymentResult = null;
  try {
    const body = req.body;
    if (!body.products) {
      res.status(500).send({
        code: 500,
        message: "No Products Found",
      });
    }
    for (let index = 0; index < body.products.length; index++) {
      const search = await Product.find(
        { _id: body.products[index].p_id },
        { stock: 1 }
      );
      if (search[0].stock < body.products[index].quantity) {
        found = true;
        let array1 = {
          index: index,
          p_id: body.products[index].p_id,
          quantity: body.products[index].quantity,
          stock: search[0].stock,
        };
        data.push(array1);
      }
    }
    if (found === true) {
      res.status(201).send({
        code: 201,
        message: "You Have To Change Quantity Of Some Products",
        data: data,
      });
    } else if (found === false) {
      // Payment
      if (body.paymentType === "online") {
        const idempontencyKey = uuidv4();
        try {
          paymentResult = stripe.customers
            .create({
              email: body.token.email,
              source: body.token.id,
            })
            .then((customer) => {
              stripe.charges.create(
                {
                  amount: body.price,
                  currency: body.currency,
                  customer: customer.id,
                  receipt_email: body.token.email,
                  description: `Purchase of ${req.params._id}`,
                },
                { idempontencyKey }
              );
            })
            .then((result) => {
              console.log("\n\n\npayment successfull:", result);
            })
            .catch((error) => {
              console.log("\n\n\nerror in make ransaction:", error);
              return res.status(500).send({
                code: 500,
                message: "Error in payment:" + error,
              });
            });
        } catch (err) {
          console.log("\n\n\n Error in make method:", err);
        }
      }
      for (let index = 0; index < body.products.length; index++) {
        const new_stock = await Product.findOneAndUpdate(
          {
            _id: body.products[index].p_id,
          },
          {
            $inc: { stock: -body.products[index].quantity },
          }
        );
        const check = await Product.find(
          { _id: body.products[index].p_id },
          { stock: 1 }
        );
        if (check[0].stock === 0) {
          let update = await Product.findOneAndUpdate(
            { _id: check[0]._id },
            {
              $set: { isdeleted: "true" },
            }
          );
        }
        saveorder = true;
      }
    }
    if (saveorder === true) {
      var datetime = new Date();
      body.entry_date = datetime;
      body.status = "pending";
      body.c_id = req.params._id;
      body.sub_total = body.sub_total;
      const orders = new Orders(body);
      const result = await orders.save();
      res.status(200).send({
        code: 200,
        message: "orders Added Successfully",
        result: paymentResult,
      });
    }
  } catch (error) {
    console.log("Place order Error:", error);
    res.status(500).send({
      code: 500,
      message: "Error",
      error: error,
    });
  }
};

OrdersController.get_admin_orders_page_limit_by_status = async (req, res) => {
  let orders;
  try {
    orders = await Orders.paginate(
      { status: req.params._status },
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: orders,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Error",
      error: error,
    });
  }
};

OrdersController.get_customer_orders_page_limit_by_id = async (req, res) => {
  try {
    const order = await Orders.paginate(
      { c_id: req.params._id, status: req.query.status },
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: order,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

OrdersController.get_delivery_boy_orders = async (req, res) => {
  try {
    const delivery = await Delivery.paginate(
      { delivery_boy_id: req.params._id, status: req.query.status },
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: delivery,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: "Error",
      error: error,
    });
  }
};
OrdersController.updateStatus = async (req, res) => {
  try {
    const order = await Orders.findOneAndUpdate(
      { _id: req.params._id },
      {
        $set: { status: req.body.status },
      }
    );
    res.status(200).send({
      code: 200,
      message: "Successful",
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = OrdersController;