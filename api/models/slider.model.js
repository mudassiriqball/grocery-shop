const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const slider = new Schema({
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
  },
  sub_category: {
    type: String,
  },
  entry_date: {
    type: Date,
  },
});

slider.plugin(mongoosePaginate);
module.exports = mongoose.model("Slider", slider);
