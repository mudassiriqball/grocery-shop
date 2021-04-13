const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const Orders = new Schema({
    // TODO
    code: {
        type: Schema.Types.ObjectId,
    },
    c_id: {
        type: String,
    },
    c_name: {
        type: String,
    },
    city: {
        type: String,
    },
    mobile: {
        type: String,
    },
    address: {
        type: String,
    },
    sub_total: {
        type: String,
    },
    shippingCharges: {
        type: String,
    },
    paymentType: {
        type: String,
    },
    products: [
        {
            vendor_id: {
                type: String,
            },
            p_id: {
                type: String,
            },
            quantity: {
                type: String,
            }
        }
    ],
    status: {
        type: String,
    },
    entry_date: {
        type: Date,
    },
    isdeleted: {
        type: Boolean,
    },
});

Orders.plugin(mongoosePaginate);

module.exports = mongoose.model("Orders", Orders);
