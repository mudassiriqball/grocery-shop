const categoriesController = {};
const Categories = require("../models/category.model");
const Sub_Categories = require("../models/sub-category.model");
// const Product = require("../models/product.model");

const jwt = require("jsonwebtoken");

categoriesController.add_Category = async (req, res) => {
  const body = req.body;
  try {
    var datetime = new Date();
    body.entry_date = datetime;

    const search = await Categories.findOne({
      label: body.category,
    });
    if (search === null) {
      body.label = body.category;
      body.value = body.category;

      const category = new Categories(body);
      const result = await category.save();

      body.label = body.sub_category;
      body.value = body.sub_category;
      body.category_id = category._id;

      const subcategory = new Sub_Categories(body);
      const result1 = await subcategory.save();
      res.status(200).send({
        code: 200,
        message: "Category Added Successfully",
      });
    } else if (search.label === body.category) {
      const search1 = await Sub_Categories.find({
        category_id: search._id,
        label: body.sub_category,
      });
      if (!search1.length) {
        body.label = body.sub_category;
        body.value = body.sub_category;
        body.category_id = search._id;
        const sub_Category = new Sub_Categories(body);
        const result1 = await sub_Category.save();
        res.status(200).send({
          code: 200,
          message: "Category Added Successfully",
        });
      } else {
        res
          .send({
            message: "Already exists",
            code: 500,
          })
          .status(500);
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

categoriesController.add_fields = async (req, res) => {
  const body = req.body;
  if (body._id === null) {
    try {
      var datetime = new Date();
      body.entry_date = datetime;
      const fields = new Fields(body);
      const result = await fields.save();
      res.status(200).send({
        code: 200,
        message: "Field Added Successfully",
      });
    } catch (error) {
      console.log("error", error);
    }
  } else {
    Field_Request.findByIdAndDelete(body._id, function (err) { });
    try {
      var datetime = new Date();
      body.entry_date = datetime;
      const fields = new Fields(body);
      const result = await fields.save();
      res.status(200).send({
        code: 200,
        message: "Fields Added Successfully",
      });
    } catch (error) {
      console.log("error", error);
    }
  }
};

categoriesController.get_categories = async (req, res) => {
  let category;
  let sub_category;

  try {
    let merged = {};
    const start = 0;
    const length = 100;
    category = await Categories.paginate(merged, {
      offset: parseInt(start),
      limit: parseInt(length),
    });
    sub_category = await Sub_Categories.paginate(merged, {
      offset: parseInt(start),
      limit: parseInt(length),
    });
    res.status(200).send({
      code: 200,
      message: "Successful",
      category,
      sub_category,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

// categoriesController.get_categories = async (req, res) => {
//   let products_category;
//   let categories = [];
//   try {
//     let merged = {};
//     const start = 0;
//     const length = 100;
//     products_category = await Categories.paginate(merged, {
//       offset: parseInt(start),
//       limit: parseInt(length)
//     });
//     var getdata = products_category.docs;
//     var i = 0;
//     getdata.forEach(element => {
//       categories[i] = { value: element.value, label: element.label };
//       i++;
//       //console.log(categories);
//     });
//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       data: categories
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

categoriesController.get_fields = async (req, res) => {
  let fields;
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    fields = await Fields.paginate(merged, {
      offset: parseInt(start),
      limit: parseInt(length),
    });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: fields,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

categoriesController.get_tags = async (req, res) => {
  let tags;
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    tags = await Product.find({}, { _id: 0, product_tags: 1 }).distinct(
      "product_tags.value"
    );
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: tags,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

categoriesController.get_unique_category = async (req, res) => {
  let home_categories;
  try {
    home_categories = await Home_Categories.paginate();
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: home_categories.docs,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

categoriesController.add_field_request = async (req, res) => {
  const body = req.body;
  const header = jwt.decode(req.headers.authorization);
  body.name = header.data.fullName;
  try {
    var datetime = new Date();
    body.entry_date = datetime;
    const custom_fields_requests = new Field_Request(body);
    const result = await custom_fields_requests.save();
    res.status(200).send({
      code: 200,
      message: "custom_fields_requested  Successfully",
    });
    return res
      .status(500)
      .send({ message: "custom_fields_requested  Successfully" });
  } catch (error) {
    console.log("error", error);
  }
};

categoriesController.add_unique_category = async (req, res) => {
  const body = req.body;
  try {
    const home_categories = new Home_Categories(body);
    const result = await home_categories.save();
    res.status(200).send({
      code: 200,
      message: "Home Categories added Successfully",
    });
  } catch (error) {
    console.log("error", error);
  }
};

categoriesController.get_field_requests = async (req, res) => {
  let fields;
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    fields = await Field_Request.paginate(merged, {
      offset: parseInt(start),
      limit: parseInt(length),
    });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: fields,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

categoriesController.delete_field_request = async (req, res) => {
  Field_Request.findByIdAndDelete(req.params._id, function (err) {
    res.status(200).send({
      code: 200,
      message: "deleted Successful",
    });
  });
};

categoriesController.delete_unique_category = async (req, res) => {
  Home_Categories.findByIdAndDelete(req.params._id, function (err) {
    res.status(200).send({
      code: 200,
      message: "deleted Successful",
    });
  });
};

categoriesController.delete_field = async (req, res) => {
  Fields.findByIdAndDelete(req.params._id, function (err) {
    res.status(200).send({
      code: 200,
      message: "deleted Successful",
    });
  });
};

categoriesController.update_field = async (req, res) => {
  const body = req.body;
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    Fields.findOneAndUpdate(
      { _id: _id },
      {
        $set: { value: body.value, label: body.label },
      },
      {
        returnNewDocument: true,
      },
      function (error, result) {
        res.status(200).send({
          code: 200,
          message: "Updated Successfully",
        });
      }
    );
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

//Update

categoriesController.update_category = async (req, res) => {
  const body = req.body;
  const _id = req.params._id;

  if (!_id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }

  try {
    if (body.category && body.imageUrl) {
      console.log("both");
      Categories.findOneAndUpdate(
        { _id: _id },
        {
          $set: { value: body.category, label: body.category, imageUrl: body.imageUrl },
        },
        {
          returnNewDocument: true,
        },
        function (error, result) {
          res.status(200).send({
            code: 200,
            message: "Sub Category Updated Successfully",
          });
        }
      );
    }
    else if (!body.imageUrl) {
      console.log("category only");
      Categories.findOneAndUpdate(
        { _id: _id },
        {
          $set: { value: body.category, label: body.category },
        },
        {
          returnNewDocument: true,
        },
        function (error, result) {
          res.status(200).send({
            code: 200,
            message: "Sub Category Updated Successfully",
          });
        }
      );
    }
    else if (!body.category) {
      console.log("image only")
      Categories.findOneAndUpdate(
        { _id: _id },
        {
          $set: { imageUrl: body.imageUrl },
        },
        {
          returnNewDocument: true,
        },
        function (error, result) {
          res.status(200).send({
            code: 200,
            message: "Sub Category Updated Successfully",
          });
        }
      );
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

categoriesController.update_sub_category = async (req, res) => {
  const body = req.body;

  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  } else {
    try {
      const _id = req.params._id;
      Sub_Categories.findOneAndUpdate(
        { _id: _id },
        {
          $set: { value: body.sub_category, label: body.sub_category },
        },
        {
          returnNewDocument: true,
        },
        function (error, result) {
          res.status(200).send({
            code: 200,
            message: "Sub Category Updated Successfully",
          });
        }
      );
    } catch (error) {
      console.log("error", error);
      return res.status(500).send(error);
    }
  }
};

module.exports = categoriesController;
