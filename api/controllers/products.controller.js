const productsController = {};
const Products = require("../models/product.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Categories = require("../models/category.model");
const Sub_categories = require("../models/sub-category.model");

productsController.add_rating_and_review = async (req, res) => {
  const body = req.body;
  var datetime = new Date();
  body.entry_date = datetime;

  var search = "";
  if (body.rating === 1) {
    search = "one_star";
  } else if (body.rating === 2) {
    search = "two_star";
  } else if (body.rating === 3) {
    search = "three_star";
  } else if (body.rating === 4) {
    search = "four_star";
  } else if (body.rating === 5) {
    search = "five_star";
  }

  const products1 = await Products.update(
    { _id: req.params._id },
    {
      $push: { "rating_review.reviews": body },
      $inc: { [`rating_review.rating.${search}`]: 1 },
    }
  );

  const products2 = await Products.findOne(
    { _id: req.params._id },
    { rating_review: 1 }
  );
  const one = products2.rating_review.rating.one_star;
  const two = products2.rating_review.rating.two_star;
  const three = products2.rating_review.rating.three_star;
  const four = products2.rating_review.rating.four_star;
  const five = products2.rating_review.rating.five_star;
  const up = one * 1 + two * 2 + three * 3 + four * 4 + five * 5;
  const down = one + two + three + four + five;
  const overall = up / down;

  const products3 = await Products.update(
    { _id: req.params._id },
    {
      $set: { "rating_review.rating.overall": overall.toFixed(1) },
    }
  );
  res.status(200).send({
    code: 200,
    message: "Thank You For Review And Rating",
  });
};
//Add product endpoint definition
productsController.addProduct = async (req, res) => {
  const body = req.body;
  try {
      var datetime = new Date();
      body.isdeleted = false;
      body.entry_date = datetime;
      const header = jwt.decode(req.headers.authorization);
      body.vendor_id = header.data._id;
      const product = new Products(body);
      const result = await product.save();
      res.status(200).send({
        code: 200,
        message: "product Added Successfully",
      });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .send({ message: "Product Added Successfully", error });
  }
};

productsController.get_vendor_product_query_search = async (req, res) => {
  const startdate = req.query.start_date;
  const enddate = req.query.end_date + "T23:59:59Z";

  var ObjectId = mongoose.Types.ObjectId;
  const _id = new ObjectId(req.params._id);

  try {
    if (req.query.field === "category") {
      let query = {};
      query = await Categories.findOne({ label: req.query.q }, { _id: 1 });

      if (!query) {
        res.status(200).send({
          code: 200,
          data: [],
          total: 0,
        });
        return;
      } else {
        const total = await Products.countDocuments({
          vendor_id: _id,
          category: query._id,
          entry_date: {
            $gte: new Date(startdate),
            $lte: new Date(enddate),
          },
        });

        const products = await Products.aggregate([
          {
            $match: {
              vendor_id: _id,
              category: query._id,
              entry_date: {
                $gte: new Date(startdate),
                $lte: new Date(enddate),
              },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" },
          {
            $lookup: {
              from: "sub_categories",
              localField: "sub_category",
              foreignField: "_id",
              as: "sub_category",
            },
          },
          { $unwind: "$sub_category" },
          {
            $skip: (req.query.page - 1) * req.query.limit,
          },
          {
            $limit: parseInt(req.query.limit),
          },
        ]);
        res.status(200).send({
          code: 200,
          message: "Successful",
          data: products,
          total,
        });
      }
    } else if (req.query.field === "sub-category") {
      let query = {};
      query = await Sub_categories.findOne({ label: req.query.q }, { _id: 1 });
      if (!query) {
        res.status(200).send({
          code: 200,
          data: [],
          total: 0,
        });
        return;
      } else {
        const total = await Products.countDocuments({
          vendor_id: _id,
          sub_category: query._id,
          entry_date: {
            $gte: new Date(startdate),
            $lte: new Date(enddate),
          },
        });
        const products = await Products.aggregate([
          {
            $match: {
              vendor_id: _id,
              sub_category: query._id,
              entry_date: {
                $gte: new Date(startdate),
                $lte: new Date(enddate),
              },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" },
          {
            $lookup: {
              from: "sub_categories",
              localField: "sub_category",
              foreignField: "_id",
              as: "sub_category",
            },
          },
          { $unwind: "$sub_category" },
          {
            $skip: (req.query.page - 1) * req.query.limit,
          },
          {
            $limit: parseInt(req.query.limit),
          },
        ]);
        res.status(200).send({
          code: 200,
          message: "Successful",
          data: products,
          total,
        });
      }
    } else if (req.query.field === "_id") {
      var ObjectId = mongoose.Types.ObjectId;
      let id = 0;
      try {
        id = new ObjectId(req.query.q);
      } catch (err) {
        res.status(200).send({
          code: 200,
          message: "Successful",
          data: [],
          total: 0,
        });
        return;
      }
      const field = req.query.field;
      const search = {};
      search[field] = id;
      search["entry_date"] = {
        $gte: new Date(startdate),
        $lte: new Date(enddate),
      };
      search["vendor_id"] = _id;
      const total = await Products.countDocuments(search);
      const products = await Products.aggregate([
        {
          $match: search,
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $lookup: {
            from: "sub_categories",
            localField: "sub_category",
            foreignField: "_id",
            as: "sub_category",
          },
        },
        { $unwind: "$sub_category" },
        {
          $skip: (req.query.page - 1) * req.query.limit,
        },
        {
          $limit: parseInt(req.query.limit),
        },
      ]);
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: products,
        total,
      });
    } else {
      const field = req.query.field;
      const search = {};
      search["vendor_id"] = _id;
      search[field] = req.query.q;
      search["entry_date"] = {
        $gte: new Date(startdate),
        $lte: new Date(enddate),
      };

      const total = await Products.countDocuments(search);
      const products = await Products.aggregate([
        {
          $match: search,
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $lookup: {
            from: "sub_categories",
            localField: "sub_category",
            foreignField: "_id",
            as: "sub_category",
          },
        },
        { $unwind: "$sub_category" },
        {
          $skip: (req.query.page - 1) * req.query.limit,
        },
        {
          $limit: parseInt(req.query.limit),
        },
      ]);
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: products,
        total,
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.get_admin_products = async (req, res) => {
  console.log("id", req.query);
  const startdate = req.query.start_date;
  const enddate = req.query.end_date + "T23:59:59Z";
  try {
    if (req.query.field === "category") {
      let query = {};
      query = await Categories.findOne({ label: req.query.q }, { _id: 1 });

      if (!query) {
        res.status(200).send({
          code: 200,
          data: [],
          total: 0,
        });
        return;
      } else {
        const total = await Products.countDocuments({
          category: query._id,
          // isdeleted: false,
          entry_date: {
            $gte: new Date(startdate),
            $lte: new Date(enddate),
          },
        });
        const products = await Products.aggregate([
          {
            $match: {
              category: query._id,
              // isdeleted: false,
              entry_date: {
                $gte: new Date(startdate),
                $lte: new Date(enddate),
              },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" },
          {
            $lookup: {
              from: "sub_categories",
              localField: "sub_category",
              foreignField: "_id",
              as: "sub_category",
            },
          },
          { $unwind: "$sub_category" },
          {
            $skip: (req.query.page - 1) * req.query.limit,
          },
          {
            $limit: parseInt(req.query.limit),
          },
        ]);
        res.status(200).send({
          code: 200,
          message: "Successful",
          data: products,
          total,
        });
      }
    } else if (req.query.field === "sub-category") {
      let query = {};
      query = await Sub_categories.findOne({ label: req.query.q }, { _id: 1 });
      if (!query) {
        res.status(200).send({
          code: 200,
          data: [],
          total: 0,
        });
        return;
      } else {
        const total = await Products.countDocuments({
          sub_category: query._id,
          // isdeleted: false,
          entry_date: {
            $gte: new Date(startdate),
            $lte: new Date(enddate),
          },
        });
        const products = await Products.aggregate([
          {
            $match: {
              sub_category: query._id,
              // isdeleted: false,
              entry_date: {
                $gte: new Date(startdate),
                $lte: new Date(enddate),
              },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" },
          {
            $lookup: {
              from: "sub_categories",
              localField: "sub_category",
              foreignField: "_id",
              as: "sub_category",
            },
          },
          { $unwind: "$sub_category" },
          {
            $skip: (req.query.page - 1) * req.query.limit,
          },
          {
            $limit: parseInt(req.query.limit),
          },
        ]);
        res.status(200).send({
          code: 200,
          message: "Successful",
          data: products,
          total,
        });
      }
    } else if (req.query.field === "_id") {
      var ObjectId = mongoose.Types.ObjectId;
      let _id = 0;
      try {
        _id = new ObjectId(req.query.q);
      } catch (err) {
        res.status(200).send({
          code: 200,
          message: "Successful",
          data: [],
          total: 0,
        });
        return;
      }

      const field = req.query.field;
      const search = {};
      search[field] = _id;
      search["entry_date"] = {
        $gte: new Date(startdate),
        $lte: new Date(enddate),
      };
      const total = await Products.countDocuments(search);
      const products = await Products.aggregate([
        {
          $match: search,
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $lookup: {
            from: "sub_categories",
            localField: "sub_category",
            foreignField: "_id",
            as: "sub_category",
          },
        },
        { $unwind: "$sub_category" },
        {
          $skip: (req.query.page - 1) * req.query.limit,
        },
        {
          $limit: parseInt(req.query.limit),
        },
      ]);
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: products,
        total,
      });
    } else {
      const entry_date = "entry_date";

      const field = req.query.field;
      const search = {};
      search[field] = req.query.q;
      search[entry_date] = {
        $gte: new Date(startdate),
        $lte: new Date(enddate),
      };
      const total = await Products.countDocuments(search);
      const products = await Products.aggregate([
        {
          $match: search,
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $lookup: {
            from: "sub_categories",
            localField: "sub_category",
            foreignField: "_id",
            as: "sub_category",
          },
        },
        { $unwind: "$sub_category" },
        {
          $skip: (req.query.page - 1) * req.query.limit,
        },
        {
          $limit: parseInt(req.query.limit),
        },
      ]);
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: products,
        total,
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.get_admin_inventory = async (req, res) => {
  try {
    let products = await Products.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "sub_categories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      { $unwind: "$sub_category" },
      {
        $skip: (req.query.page - 1) * req.query.limit,
      },
      {
        $limit: parseInt(req.query.limit),
      },
    ]);
    //if (products.length) {
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: products,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.get_products_by_category = async (req, res) => {
  try {
    if (req.query.subCategory) {
      let products = await Products.paginate({
        isdeleted: false,
        categoryId: req.query.category,
        subCategoryId: req.query.subCategory,
      },
        {
          limit: parseInt(req.query.limit),
          page: parseInt(req.query.page),
        });
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: products,
      });
    } else if (!req.query.subCategory) {
      let products = await Products.paginate({
        isdeleted: false,
        categoryId: req.query.category,
      },
        {
          limit: parseInt(req.query.limit),
          page: parseInt(req.query.page),
        });
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: products,
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({
      code: 200,
      message: "ERROR",
      error: error,
    });
  }
};

productsController.get_all_products = async (req, res) => {
  try {
    const total = await Products.countDocuments({
      isdeleted: false,
    });
    const products = await Products.aggregate([
      {
        $match: {
          isdeleted: false,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "sub_categories",
          localField: "sub_category",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      { $unwind: "$sub_category" },
      {
        $skip: (req.query.page - 1) * req.query.limit,
      },
      {
        $limit: parseInt(req.query.limit),
      },
    ]);
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: products,
      total,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

productsController.get_product_by_id = async (req, res) => {
  try {
    var ObjectId = mongoose.Types.ObjectId;
    const _id = new ObjectId(req.params._id);
    const products = await Products.aggregate([
      {
        $match: {
          _id: _id,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "sub_categories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      { $unwind: "$sub_category" },
    ]);
    if (products.length) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: products,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "This Product Does Not Exists",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.get_all_product_by_id = async (req, res) => {
  try {
    var ObjectId = mongoose.Types.ObjectId;
    const _id = new ObjectId(req.params._id);
    const products = await Products.aggregate([
      {
        $match: {
          _id: _id,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "sub_categories",
          localField: "sub_category",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      { $unwind: "$sub_category" },
    ]);
    if (products.length) {
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: products,
      });
    } else {
      res.status(500).send({
        code: 500,
        message: "This Product Does Not Exists",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

//Get All Products of specific vendor endpoint definition
productsController.get_vendor_products = async (req, res) => {
  console.log("aaaa");
  try {
    var ObjectId = mongoose.Types.ObjectId;
    const _id = new ObjectId(req.params._id);
    const total = await Products.countDocuments({
      vendor_id: _id,
      isdeleted: false,
    });
    const products = await Products.aggregate([
      {
        $match: {
          vendor_id: _id,
          isdeleted: false,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "sub_categories",
          localField: "sub_category",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      { $unwind: "$sub_category" },
      {
        $skip: (req.query.page - 1) * req.query.limit,
      },
      {
        $limit: parseInt(req.query.limit),
      },
    ]);
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: products,
      total,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.getSingleProduct = async (req, res) => {
  let product;
  try {
    const _id = req.params._id;
    product = await products.findOne({ _id: _id });
    res.status(200).send({
      code: 200,
      message: "Successful",
      product,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.deleteProduct = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    Products.findOneAndUpdate(
      { _id: _id },
      {
        $set: { isdeleted: true },
      },
      {
        returnNewDocument: true,
      },
      function (error, result) {
        res.status(200).send({
          code: 200,
          message: "Deleted Successfully",
        });
      }
    );
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.updateProduct = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    let updates = req.body;
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

async function runUpdate(_id, updates, res) {
  try {
    const result = await Products.updateOne(
      {
        _id: _id,
      },
      {
        $set: updates,
      },
      {
        upsert: true,
        runValidators: true,
      }
    );

    {
      if (result.nModified == 1) {
        res.status(200).send({
          code: 200,
          message: "Updated Successfully",
        });
      } else if (result.upserted) {
        res.status(200).send({
          code: 200,
          message: "Created Successfully",
        });
      } else {
        res.status(422).send({
          code: 422,
          message: "Unprocessible Entity",
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
}
async function runUpdateById(id, updates, res) {
  try {
    const result = await products.updateOne(
      {
        id: id,
      },
      {
        $set: updates,
      },
      {
        upsert: true,
        runValidators: true,
      }
    );

    if (result.nModified == 1) {
      res.status(200).send({
        code: 200,
        message: "Updated Successfully",
      });
    } else if (result.upserted) {
      res.status(200).send({
        code: 200,
        message: "Created Successfully",
      });
    } else {
      res.status(200).send({
        code: 200,
        message: "Task completed successfully",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
}

productsController.get_total_products = async (req, res) => {
  let products;
  try {
    products = await Products.paginate();
    const count = products.total;
    res.status(200).send({
      code: 200,
      message: "Successful",
      count,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.get_total_sold = async (req, res) => {
  let products;
  var count = 0;
  try {
    products = await Products.paginate();
    var come = products.docs;

    come.forEach((element) => {
      count = count + element.product_in_stock;
    });
    res.status(200).send({
      code: 200,
      message: "Successful",
      count,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.geteverything = async (req, res) => {
  var ObjectId = mongoose.Types.ObjectId;
  const _id = new ObjectId(req.params._id);

  const product0 = await Products.paginate({
    vendor_id: req.params._id,
  });
  const product1 = await Products.aggregate([
    {
      $match: {
        product_in_stock: { $gt: 0 },
        vendor_id: _id,
        product_type: "simple-product",
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  const product2 = await Products.aggregate([
    {
      $match: {
        product_type: "variable-prouct",
        vendor_id: _id,
      },
    },
    {
      $unwind: "$product_variations",
    },
    {
      $match: {
        "product_variations.stock": { $gt: 0 },
      },
    },
    {
      $group: {
        _id: "null",
        count: { $sum: 1 },
      },
    },
    {
      $project: { _id: 0 },
    },
  ]);
  const total_products = product0.total;
  const in_stock_products = product1[0].count + product2[0].count;
  console.log("total Products", total_products);
  console.log("total stock", in_stock_products);
  res.status(200).send({
    code: 200,
    message: "ok",
    total_products,
    in_stock_products,
  });
};

productsController.get_search_products = async (req, res) => {
  const query = req.query.q;
  var regex = new RegExp(["^", query, "$"].join(""), "i");

  let actual_products = 0;
  let products1 = 0;
  let products2 = 0;
  let products3 = 0;
  let set = 0;
  try {
    const products = await Products.paginate({ name: regex });
    if (products.total > 0) {
      console.log("1");
      actual_products = products;
    }
    if (products.total === 0) {
      console.log("2");
      category = await Categories.find({ value: regex }, { _id: 1 });
      if (category.length > 0) {
        console.log("3");
        products1 = await Products.paginate({ categoryId: category[0]._id });
        if (products1.total > 0) {
          console.log("4");
          actual_products = products1;
        } else {
          console.log("5");
          set = 1;
        }
      } else {
        console.log("6");
        set = 1;
      }
    }

    if (set === 1) {
      console.log("7");

      sub_category = await Sub_categories.find({ value: regex }, { _id: 1 });
      if (sub_category.length > 0) {
        console.log("8");
        products2 = await Products.paginate({
          subCategoryId: sub_category[0]._id,
        });
        if (products2.total > 0) {
          console.log("9");
          actual_products = products2;
        } else {
          console.log("10");
          set = 2;
        }
      } else {
        console.log("11");
        set = 2;
      }
    }

    if (set === 2) {
      console.log("12");
      products3 = await Products.paginate({ name: new RegExp(query, "i") });
      if (products3.total > 0) {
        console.log("13");
        actual_products = products3;
      } else {
        console.log("14");
        set = 3;
      }
    }


    res.status(200).send({
      code: 200,
      message: "Successful",
      data: actual_products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

productsController.get_less_stock_products = async (req, res) => {
  let simple_total;
  let simple_product;
  let variable_total;
  let variable_product;

  var ObjectId = mongoose.Types.ObjectId;
  let _id;
  try {
    _id = new ObjectId(req.params._id);
  } catch (err) {
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: [],
      total: 0,
    });
    return;
  }
  try {
    simple_total = await Products.countDocuments({
      vendor_id: _id,
      product_type: "simple-product",
      isdeleted: false,
      product_in_stock: { $lt: 5 },
    });

    simple_product = await Products.aggregate([
      {
        $match: {
          vendor_id: _id,
          product_type: "simple-product",
          isdeleted: false,
          product_in_stock: { $lt: 5 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "sub_categories",
          localField: "sub_category",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      { $unwind: "$sub_category" },
      {
        $skip: (req.query.page - 1) * req.query.limit,
      },
      {
        $limit: parseInt(req.query.limit),
      },
    ]);

    variable_total = await Products.countDocuments({
      vendor_id: _id,
      product_type: "variable-prouct",
      isdeleted: false,
      "product_variations.stock": { $lt: 5 },
    });

    variable_product = await Products.aggregate([
      {
        $match: {
          vendor_id: _id,
          product_type: "variable-prouct",
          isdeleted: false,
          "product_variations.stock": { $lt: 5 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "sub_categories",
          localField: "sub_category",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      { $unwind: "$sub_category" },
      {
        $skip: (req.query.page - 1) * req.query.limit,
      },
      {
        $limit: parseInt(req.query.limit),
      },
    ]);
    res.status(200).send({
      code: 200,
      message: "Successful",
      simple_product,
      simple_total,
      variable_product,
      variable_total,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.get_vendor_product_less_stock_by_id = async (req, res) => {
  let simple_total;
  let simple_product;
  let variable_total;
  let variable_product;

  var ObjectId = mongoose.Types.ObjectId;
  let _id;
  let id;
  try {
    _id = new ObjectId(req.params._id);
    id = new ObjectId(req.query.q);
  } catch (err) {
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: [],
      total: 0,
    });
    return;
  }
  try {
    simple_total = await Products.countDocuments({
      _id: id,
      vendor_id: _id,
      product_type: "simple-product",
      isdeleted: false,
      product_in_stock: { $lt: 5 },
    });

    simple_product = await Products.aggregate([
      {
        $match: {
          _id: id,
          vendor_id: _id,
          product_type: "simple-product",
          isdeleted: false,
          product_in_stock: { $lt: 5 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "sub_categories",
          localField: "sub_category",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      { $unwind: "$sub_category" },
    ]);

    variable_total = await Products.countDocuments({
      _id: id,
      vendor_id: _id,
      product_type: "variable-prouct",
      isdeleted: false,
      "product_variations.stock": { $lt: 5 },
    });

    variable_product = await Products.aggregate([
      {
        $match: {
          _id: id,
          vendor_id: _id,
          product_type: "variable-prouct",
          isdeleted: false,
          "product_variations.stock": { $lt: 5 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "sub_categories",
          localField: "sub_category",
          foreignField: "_id",
          as: "sub_category",
        },
      },
      { $unwind: "$sub_category" },
    ]);
    res.status(200).send({
      code: 200,
      message: "Successful",
      simple_product,
      simple_total,
      variable_product,
      variable_total,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.get_search_all_product = async (req, res) => {

  const field = req.query.field;
  const search = {};
  search[field] = req.query.q;
  try {
    let products = await Products.paginate(search, {
      limit: parseInt(req.query.limit),
      page: parseInt(req.query.page),
    });
    res.status(200).send({
      data: products,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.update_product_data = async (req, res) => {
  const body = req.body;
  try {
    if (body.stock > 0)
      body.isdeleted = false;
    const _id = req.params._id;
    Products.findOneAndUpdate(
      { _id: _id },
      {
        $set: body,
      },
      {
        returnNewDocument: true,
      },
      function (error, result) {
        res.status(200).send({
          code: 200,
          message: "updated Successfully",
        });
      }
    );
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.delete_product = async (req, res) => {
  const body = req.body;
  try {
    const _id = req.params._id;
    Products.findOneAndUpdate(
      { _id: _id },
      {
        $set: { isdeleted: true },
      },
      {
        returnNewDocument: true,
      },
      function (error, result) {
        res.status(200).send({
          code: 200,
          message: "updated Successfully",
        });
      }
    );
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};


productsController.update_product_variation_data = async (req, res) => {
  const body = req.body;
  try {
    const product = await Products.findOneAndUpdate(
      { "product_variations._id": req.query.variation_id },
      {
        $set: {
          ["product_variations.$[i].price"]: body.price,
          ["product_variations.$[i].stock"]: body.stock,
          ["product_variations.$[i].discount"]: body.discount,
        },
      },
      {
        arrayFilters: [{ "i._id": req.query.variation_id }],
        multi: true,
      }
    );
    res.status(200).send({
      code: 200,
      message: "updated Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

module.exports = productsController;
