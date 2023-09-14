const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  status: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: 'pending'
      },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;








// const { Schema, model } = require('mongoose');

// const orderSchema = new Schema({
//   _id: {
//     type: String,
//     required: true
//   },
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',  
//     required: true
//   },
//   invoiceAmount: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ["pending", "shipped", "delivered"],
//     default: 'pending'
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   products: [
//     {
//       product: {
//         type: Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//       },
//       quantity: {
//         type: Number,
//         required: true
//       }
//     }
//   ],
// });

// const Order = model('Order', orderSchema);

// module.exports = Order;
