import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Cấu hình Storage cho Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'project-images', // Tên folder trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'], // Định dạng cho phép
    } as any // ép kiểu any để tránh lỗi TypeScript nhỏ ở thư viện này
});

export default storage;