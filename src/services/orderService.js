import api from "../api/axios";

export const createOrder = async (orderData) => {
    const response = await api.post("/orders", orderData);

    if (!response.data.success || !response.data.data) {
        throw new Error(
            response.data.message || "Unable to place your order."
        );
    }

    return response.data.data;
};

export const trackOrder = async (orderId, phone) => {
    const response = await api.post(
        `/orders/${orderId}/track`,
        { phone }
    );

    if (!response.data.success || !response.data.data) {
        throw new Error(
            response.data.message || "Unable to track your order."
        );
    }

    return response.data.data;
};
