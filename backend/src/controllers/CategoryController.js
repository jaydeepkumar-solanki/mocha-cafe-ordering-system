const Category = require("../models/Category");
const fs = require("fs").promises;
const path = require("path");

// Category image upload directory
const categoryUploadDir = path.resolve(__dirname, "../../uploads/categories");

// Safely delete an unused category image
const deleteCategoryImageIfUnused = async (imagePath) => {
  try {
    if (
      typeof imagePath !== "string" ||
      !imagePath.startsWith("/uploads/categories/")
    ) {
      return;
    }

    // Extract filename
    const filename = imagePath.slice("/uploads/categories/".length);

    // Prevent directory traversal
    if (!filename || path.basename(filename) !== filename) {
      return;
    }

    // Check whether another category uses this image
    const imageInUse = await Category.exists({
      image: imagePath,
    });

    if (imageInUse) {
      return;
    }

    // Get exact file location
    const filePath = path.resolve(categoryUploadDir, filename);

    if (path.dirname(filePath) !== categoryUploadDir) {
      return;
    }

    // Delete physical image file
    await fs.unlink(filePath);

    console.log(`Category image deleted: ${filename}`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Category image cleanup failed:", error.message);
    }
  }
};

// 1. Create Category
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image, isActive } = req.body;

    // Generate slug automatically if not provided
    const categorySlug =
      slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const category = await Category.create({
      name,
      slug: categorySlug,
      description,
      image,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get All Categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Single Category
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Update Category
const updateCategory = async (req, res, next) => {
  try {
    const existingCategory = await Category.findById(req.params.id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Save previous image path
    const oldImage = existingCategory.image;

    // Prepare update data
    const updateData = { ...req.body };

    // Generate slug if name changes and slug is not provided
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    // Update category in MongoDB
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    // Delete old image if replaced
    if (oldImage && oldImage !== updatedCategory.image) {
      await deleteCategoryImageIfUnused(oldImage);
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Category
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete category image if no other category uses it
    if (category.image) {
      await deleteCategoryImageIfUnused(category.image);
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Export all controller functions
module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
