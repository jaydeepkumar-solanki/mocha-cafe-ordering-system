
const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");

// Product image upload directory
const productUploadDir = path.resolve(__dirname, "../../uploads/products");

// Validate category ID and ensure category exists and is active
const validateCategory = async (categoryId) => {
  if (
    typeof categoryId !== "string" ||
    !/^[0-9a-fA-F]{24}$/.test(categoryId)
  ) {
    return null;
  }

  return Category.findOne({
    _id: categoryId,
    isActive: true,
  });
};

// Safely delete an unused product image
const deleteProductImageIfUnused = async (imagePath) => {
  try {
    if (
      typeof imagePath !== "string" ||
      !imagePath.startsWith("/uploads/products/")
    ) {
      return;
    }

    const filename = imagePath.slice("/uploads/products/".length);

    if (!filename || path.basename(filename) !== filename) {
      return;
    }

    const imageInUse = await Product.exists({ image: imagePath });

    if (imageInUse) {
      return;
    }

    const filePath = path.resolve(productUploadDir, filename);

    if (path.dirname(filePath) !== productUploadDir) {
      return;
    }

    await fs.unlink(filePath);

    console.log(`Product image deleted: ${filename}`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Product image cleanup failed:", error.message);
    }
  }
};

// 1. Create Product
const createProduct = async (req, res, next) => {
  try {
    const category = await validateCategory(req.body.category);

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID or category is inactive.",
      });
    }

    const product = await Product.create(req.body);

    await product.populate("category", "name slug image isActive");

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get All Products
const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      isAvailable,
      isFeatured,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    // Pagination validation
    const currentPage = Number(page);
    const perPage = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      !Number.isInteger(perPage) ||
      currentPage < 1 ||
      perPage < 1 ||
      perPage > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid page or limit. Page must be positive and limit must be between 1 and 100.",
      });
    }

    // Build filter query
    const filter = {};

    // Search by product name or description
    if (search && search.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    // Filter by MongoDB category ID
    if (category && category.trim()) {
      if (!/^[0-9a-fA-F]{24}$/.test(category.trim())) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID.",
        });
      }

      filter.category = new mongoose.Types.ObjectId(category.trim());
    }

    // Filter by minimum price
    if (minPrice !== undefined) {
      const minimum = Number(minPrice);

      if (!Number.isFinite(minimum) || minimum < 0) {
        return res.status(400).json({
          success: false,
          message: "minPrice must be a valid non-negative number.",
        });
      }

      filter.price = {
        ...filter.price,
        $gte: minimum,
      };
    }

    // Filter by maximum price
    if (maxPrice !== undefined) {
      const maximum = Number(maxPrice);

      if (!Number.isFinite(maximum) || maximum < 0) {
        return res.status(400).json({
          success: false,
          message: "maxPrice must be a valid non-negative number.",
        });
      }

      filter.price = {
        ...filter.price,
        $lte: maximum,
      };
    }

    if (
      filter.price?.$gte !== undefined &&
      filter.price?.$lte !== undefined &&
      filter.price.$gte > filter.price.$lte
    ) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than maxPrice.",
      });
    }

    // Filter by availability
    if (isAvailable !== undefined) {
      if (!["true", "false"].includes(isAvailable)) {
        return res.status(400).json({
          success: false,
          message: "isAvailable must be true or false.",
        });
      }

      filter.isAvailable = isAvailable === "true";
    }

    // Filter featured products
    if (isFeatured !== undefined) {
      if (!["true", "false"].includes(isFeatured)) {
        return res.status(400).json({
          success: false,
          message: "isFeatured must be true or false.",
        });
      }

      filter.isFeatured = isFeatured === "true";
    }

    // Sorting options
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
    };

    if (!sortOptions[sort]) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort option.",
        allowedSortOptions: Object.keys(sortOptions),
      });
    }

    const skip = (currentPage - 1) * perPage;

    // Fetch products with populated category details
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug image isActive")
        .sort(sortOptions[sort])
        .skip(skip)
        .limit(perPage),

      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / perPage);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      pagination: {
        currentPage,
        limit: perPage,
        totalProducts,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
      filters: {
        search: search || "",
        category: category || "",
        minPrice: minPrice ?? null,
        maxPrice: maxPrice ?? null,
        isAvailable: isAvailable ?? null,
        isFeatured: isFeatured ?? null,
        sort,
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Single Product
const getSingleProduct = async (req, res, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(req.params.id)
      .populate("category", "name slug image isActive");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Update Product
const updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Validate category only when it is being changed
    if (req.body.category !== undefined) {
      const category = await validateCategory(req.body.category);

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID or category is inactive.",
        });
      }
    }

    const oldImage = existingProduct.image;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name slug image isActive");

    if (oldImage && oldImage !== updatedProduct.image) {
      await deleteProductImageIfUnused(oldImage);
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Delete Product
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.image) {
      await deleteProductImageIfUnused(product.image);
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
