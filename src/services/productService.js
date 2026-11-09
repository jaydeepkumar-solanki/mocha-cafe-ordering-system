
import api from "../api/axios";

const API_ORIGIN = (
import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

export const getProducts = async () => {
const response = await api.get("/products", {
    params: {
        page: 1,
        limit: 100,
        sort: "newest",
        isAvailable: true,
    },
});

if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error("Invalid products API response");
}

return response.data.data.map((product) => ({
    ...product,

    // Keep the existing React cart compatible
    id: product._id,

    // Convert uploaded image paths into accessible URLs
    image: product.image
        ? product.image.startsWith("http")
            ? product.image
            : `${API_ORIGIN}${product.image.startsWith("/") ? "" : "/"}${product.image}`
        : "",
    
    // Map backend featured status to the existing card property
    bestseller: product.isFeatured,
}));
};
