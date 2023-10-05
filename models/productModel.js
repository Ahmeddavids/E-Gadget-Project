const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    images: { type: Array },
    color: { type: String, required: true },
    ratings: [
      {
        star: Number,
        comment: String,
        postedTime: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    starRating: { type: String, default: 0 },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
