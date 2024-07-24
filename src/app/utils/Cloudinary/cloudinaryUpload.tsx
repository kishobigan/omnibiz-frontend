import axios from 'axios';

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'omnibiz');

    try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/ddpiq6rir/image/upload', formData);
        if (response.data && response.data.secure_url) {
            return response.data.secure_url;
        } else if (response.data && response.data.url) {
            return response.data.url;
        } else {
            throw new Error('Failed to upload image to Cloudinary');
        }
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
};
