const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const sub_category = new Schema({ 
  category_id: {
    type: Schema.Types.ObjectId,
  },
    label: { type: String },
    value: { type: String },
});

sub_category.plugin(mongoosePaginate);

module.exports = mongoose.model("Sub_Category", sub_category);