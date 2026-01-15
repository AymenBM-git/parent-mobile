// Replace with your computer's local IP address (e.g., 192.168.1.XX)
// You can find it by running 'ipconfig' in your terminal
export const BASE_URL = 'http://192.168.1.8:3000';

export const apiFetch = async (endpoint: string, options: any = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    return response;
};
