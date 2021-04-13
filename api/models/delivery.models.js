const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const delivery = new Schema({
  order_id: {
    type: Schema.Types.ObjectId,
  },
  status: {
    type: String,
  },
  entry_date: {
    type: Date,
  },
  delivery_boy_id:{
    type: Schema.Types.ObjectId,
  }
});

delivery.plugin(mongoosePaginate);
module.exports = mongoose.model("Delivery", delivery);
