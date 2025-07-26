import axios from 'axios';

const API_URL = 'http://10.0.2.2:5001';

export const registerUser = async (fullname, email, phone, password) => {
    try {
        console.log("Sending Data to API:", { fullname, email, phone, password });

        // การลงทะเบียน
        const response = await axios.post(`${API_URL}/register`, { fullname, email, phone, password });

        console.log("Register successful:", response.data);
        return response.data;
    } 
    catch (error) {
        console.error("Register failed:", error.response?.data || error.message);

        if (!error.response) {
            throw new Error("Network error. Please check your connection.");
        }

        throw new Error(error.response?.data?.message || "Error registering user");
    }
};

export const loginUser = async (identifier, password) => {
    try {
        console.log("Sending Data to API:", { identifier, password });

        const payload = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) 
            ? { email: identifier, password } 
            : { phone: identifier, password };

        const response = await axios.post(`${API_URL}/login`, payload);

        console.log("API Response:", response.data);

        return response.data;
    } catch (error) {
        console.error("API Login Error:", error.response?.data || error.message);
        if (error.response) {

            console.log("API Response Error:", error.response.data);
        }
        throw new Error(error.response?.data?.message || "Error logging in");
    }
};


