const productModel = require("../models/productModel");
const cloudinary = require("../utils/cloudinary");
const { getCurrentDateTime } = require("../utils/currentDate");

const newProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      price,
      category,
      brand,
      quantity,
      color,
    } = req.body;
    const newProduct = await productModel.create({
      productName,
      description,
      price,
      category,
      brand,
      quantity,
      color,
    });
    if (req.files) {
      let images = [];
      if (req.files.images.length > 1) {
        for (let index = 0; index < req.files.images.length; index++) {
          const result = await cloudinary.uploader.upload(
            req.files.images[index].tempFilePath
          );
          images.push(result.secure_url);
        }
      } else {
        const result = await cloudinary.uploader.upload(
          req.files.images.tempFilePath
        );
        images.push(result.secure_url);
      }
      newProduct.images = images;
      await newProduct.save();
    }
    const product = await productModel.findById(newProduct._id);
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const findProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel
      .findById(id)
      .populate("ratings.postedBy", ["firstName", "lastName"]);
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    //  array of allowed fields
    const allowedFields = ["productName", "brand", "category"];

    //  object with only the allowed fields from the query
    const queryObj = {};
    for (const field of allowedFields) {
      if (req.query[field]) {
        queryObj[field] = req.query[field];
      }
    }
    let query = productModel.find(queryObj);
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    if (req.query.page && req.query.limit) {
      query = query.skip(parseInt(skip)).limit(parseInt(limit));
      const productCount = await productModel.countDocuments(queryObj);
      if (skip >= productCount) {
        return res.status(404).json({
          message: "This page does not exist",
        });
      }
    }
    const allProducts = await query;
    res.status(200).json({
      allProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      description,
      price,
      category,
      brand,
      quantity,
      color,
    } = req.body;
    const product = await productModel.findByIdAndUpdate(
      id,
      {
        productName,
        description,
        price,
        category,
        brand,
        quantity,
        color,
      },
      { new: true }
    );
    if (req.files) {
      let images = [];
      if (req.files.images.length > 1) {
        for (let index = 0; index < product.images.length; index++) {
          publicId = product.images[index].split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
        for (let index = 0; index < req.files.images.length; index++) {
          const result = await cloudinary.uploader.upload(
            req.files.images[index].tempFilePath
          );
          images.push(result.secure_url);
        }
      } else {
        for (let index = 0; index < product.images; index++) {
          publicId = product.images[index].split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
        const result = await cloudinary.uploader.upload(
          req.files.images.tempFilePath
        );
        images.push(result.secure_url);
      }
      product.images = images;
      await product.save();
    }
    const updatedProduct = await productModel.findById(tour._id);
    res.status(200).json({
      success: true,
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const productRating = async (req, res) => {
  const { userId } = req.user;
  const { star, comment } = req.body;
  const { productId } = req.params;
  console.log(req.body);
  try {
    const product = await productModel.findById(productId);
    let alreadyRated = product.ratings.find(
      (obj) => obj.postedBy?.toString() === userId.toString()
    );
    const date = getCurrentDateTime();

    if (alreadyRated) {
      // Update existing rating
      await productModel.updateOne(
        {
          _id: productId,
          ratings: {
            $elemMatch: alreadyRated,
          },
        },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": comment,
            "ratings.$.postedTime": date,
          },
        },
        { new: true }
      );
    } else {
      // Add new rating
      await productModel.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedTime: date,
              postedBy: userId,
            },
          },
        },
        { new: true }
      );
    }

    // Calculate the average star rating
    const ratedproduct = await productModel.findById(productId);
    let totalRatings = ratedproduct.ratings.length;
    let sumOfStars = ratedproduct.ratings
      .map((rating) => rating.star)
      .reduce((prev, curr) => prev + curr, 0);

    let starRating = 0; // Default value for starRating

    // Avoid division by zero
    if (totalRatings > 0) {
      starRating = Math.round(sumOfStars / totalRatings);
    }

    const finalUpdate = await productModel
      .findByIdAndUpdate(
        productId,
        {
          starRating,
        },
        { new: true }
      )
      .populate("ratings.postedBy", ["firstName", "lastName"]);

    res.status(200).json(finalUpdate);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProductRating = async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.params;
  try {
    const product = await productModel.findById(productId);
    let alreadyRated = product.ratings.find(
      (obj) => obj.postedBy.toString() === userId.toString()
    );
    if (alreadyRated) {
      const updatedproduct = await productModel.findByIdAndUpdate(
        productId,
        {
          $pull: {
            ratings: {
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
      // Recalculate the star rating after removing the rating
      let totalRatings = updatedproduct.ratings.length;
      let sumOfStars = updatedproduct.ratings
        .map((rating) => rating.star)
        .reduce((prev, curr) => prev + curr, 0);
      starRating = totalRatings > 0 ? Math.round(sumOfStars / totalRatings) : 0;
      console.log(starRating);
      const finalupdatedproduct = await productModel
        .findByIdAndUpdate(
          productId,
          {
            starRating,
          },
          { new: true }
        )
        .populate("ratings.postedBy", ["firstName", "lastName"]);
      res.status(200).json(finalupdatedproduct);
    } else {
      res.status(404).json({
        message: "Rating not found for this tour and user.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  newProduct,
  getAllProducts,
  updateProductById,
  productRating,
  deleteProductRating,
  findProductById,
};
