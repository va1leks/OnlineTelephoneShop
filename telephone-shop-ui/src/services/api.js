const API_BASE = 'http://localhost:8080/telshop';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            errorText: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    return response.json();
};

export const getAllTelephones = async () => {
    try {
        const response = await fetch(`${API_BASE}/telephones/all`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error('API Error in getAllTelephones:', error);
        throw error;
    }
};

export const getTelephoneById = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/telephones/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error('API Error in getTelephoneById:', error);
        throw error;
    }
};

export const addToCart = async (clientId, telephoneId) => {
    try {
        const response = await fetch(`${API_BASE}/cart/add?clientId=${clientId}&telephoneId=${telephoneId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error('API Error in addToCart:', error);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        console.log('Sending order data:', orderData);

        const response = await fetch(`${API_BASE}/orders/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        console.log('Order response status:', response.status);
        const result = await handleResponse(response);
        console.log('Order created successfully:', result);
        return result;
    } catch (error) {
        console.error('API Error in createOrder:', error);
        throw error;
    }
};