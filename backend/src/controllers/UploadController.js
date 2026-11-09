
const uploadImage = (req, res) => {
    try {

        // Check whether an image was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image to upload"
            });
        }

        const type = req.params.type;

        // Generate relative image path
        const imagePath = `/uploads/${type === "product" ? "products" : "categories"}/${req.file.filename}`;

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: {
                filename: req.file.filename,
                path: imagePath,
                url: `${req.protocol}://${req.get("host")}${imagePath}`,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Image upload failed",
            error: error.message
        });

    }
};

module.exports = {
    uploadImage
};
