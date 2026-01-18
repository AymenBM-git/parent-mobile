// Replace with your computer's local IP address (e.g., 192.168.1.XX)
// You can find it by running 'ipconfig' in your terminal
export const BASE_URL = 'https://leaders-boumhel.vercel.app'///'http://192.168.1.8:3000';

export const apiFetch = async (endpoint: string, options: any = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const parentData = localStorage.getItem('parent');
    const parent = parentData ? JSON.parse(parentData) : {};

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(parent.id ? { 'X-Parent-Id': parent.id.toString() } : {}),
            ...options.headers,
        },
    });

    if (response.status === 403 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('parent');
        window.location.href = '/login';
    }

    return response;
};
