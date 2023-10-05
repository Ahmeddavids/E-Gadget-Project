const { Router } = require("express");
const {
  newProduct,
  getAllProducts,
  updateProductById,
  productRating,
  deleteProductRating,
  findProductById,
} = require("../controllers/productController");
const { authenticate, isAdmin } = require("../utils/authentication");

const productRouter = Router();

productRouter.post("/create-product", authenticate, isAdmin, newProduct);
productRouter.get("/find-products", getAllProducts);
productRouter.put(
  "/update-product/:id",
  authenticate,
  isAdmin,
  updateProductById
);
productRouter.put("/rate-product/:productId", authenticate, productRating);
productRouter.put(
  "/delete-rating/:productId",
  authenticate,
  deleteProductRating
);
productRouter.get("/get-product/:id", findProductById);

module.exports = productRouter;
