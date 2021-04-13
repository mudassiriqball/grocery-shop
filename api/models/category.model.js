const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const Category = new Schema({
    label: { 
      type: String
     },
    value: { 
      type: String 
    },
  entry_date: {
    type: Date,
  },
  imageUrl: {
    type: String
  }
});

Category.plugin(mongoosePaginate);

module.exports = mongoose.model("Categories", Category);