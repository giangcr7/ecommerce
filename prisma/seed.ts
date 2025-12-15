import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Bắt đầu tạo dữ liệu mẫu (Seeding) cho Cửa hàng Công nghệ...');

    // --------------------------------------------------------
    // 1. TẠO ROLES (VAI TRÒ)
    // --------------------------------------------------------
    const roleAdmin = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
            description: 'Quản trị viên hệ thống, có full quyền truy cập',
        },
    });

    const roleUser = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: {
            name: 'USER',
            description: 'Khách hàng thành viên, có thể mua hàng',
        },
    });

    console.log('✅ Đã khởi tạo Roles: ADMIN, USER');

    // --------------------------------------------------------
    // 2. TẠO TÀI KHOẢN ADMIN
    // --------------------------------------------------------
    const hashedPassword = await bcrypt.hash('123456', 10);

    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            fullName: 'Admin Aliconcon',
            roleId: roleAdmin.id,
            accountType: 'local',
            avatar: 'https://cdn-icons-png.flaticon.com/512/147/147142.png',
            address: 'Hà Nội',
            phone: '0909999888'
        },
    });

    console.log('✅ Đã tạo User Admin: admin@gmail.com / 123456');

    // --------------------------------------------------------
    // 3. TẠO DANH MỤC (CATEGORIES) - [CÔNG NGHỆ]
    // --------------------------------------------------------
    const categoriesData = [
        { name: 'Laptop Gaming', description: 'Máy tính xách tay cấu hình cao chơi game' },
        { name: 'Laptop Văn Phòng', description: 'Mỏng nhẹ, pin trâu, sang trọng' },
        { name: 'Điện Thoại', description: 'Smartphone Android và iPhone' },
        { name: 'Phụ Kiện', description: 'Chuột, bàn phím, tai nghe, balo' }
    ];

    const createdCategories = [];

    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
        createdCategories.push(category);
    }

    console.log(`✅ Đã tạo ${createdCategories.length} Danh mục Công nghệ`);

    // --------------------------------------------------------
    // 4. TẠO SẢN PHẨM MẪU (PRODUCTS)
    // --------------------------------------------------------
    const productCount = await prisma.product.count();

    if (productCount === 0) {
        // Lấy ID danh mục để gán
        const catGaming = createdCategories.find(c => c.name === 'Laptop Gaming');
        const catOffice = createdCategories.find(c => c.name === 'Laptop Văn Phòng');
        const catPhone = createdCategories.find(c => c.name === 'Điện Thoại');
        const catAccessory = createdCategories.find(c => c.name === 'Phụ Kiện');

        await prisma.product.createMany({
            data: [
                // Laptop Gaming
                {
                    name: 'Asus ROG Strix G15',
                    price: 25000000,
                    quantity: 10,
                    image: 'https://dlcdnwebimgs.asus.com/gain/46504285-8839-4467-8094-099787132039/w1000/fwebp',
                    shortDesc: 'Laptop Gaming cấu hình khủng, màn hình 144Hz.',
                    detailDesc: 'CPU: Ryzen 7 6800H, RAM: 16GB, SSD: 512GB, VGA: RTX 3050.',
                    target: 'Gaming',
                    factory: 'Asus',
                    categoryId: catGaming?.id
                },
                {
                    name: 'Acer Nitro 5 Tiger',
                    price: 19500000,
                    quantity: 15,
                    image: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/Uploads/images/2015/0511/0005/acer-nitro-5-tiger-an515-58-1.jpg',
                    shortDesc: 'Quốc dân Gaming, thiết kế hầm hố.',
                    detailDesc: 'CPU: Core i5 12500H, RAM: 8GB, VGA: RTX 3050Ti.',
                    target: 'Gaming',
                    factory: 'Acer',
                    categoryId: catGaming?.id
                },
                // Laptop Văn Phòng
                {
                    name: 'MacBook Air M1 2020',
                    price: 18990000,
                    quantity: 20,
                    image: 'https://cdn.tgdd.vn/Products/Images/44/231244/macbook-air-m1-2020-gray-600x600.jpg',
                    shortDesc: 'Siêu mỏng nhẹ, pin 18 tiếng.',
                    detailDesc: 'Chip Apple M1, RAM 8GB, SSD 256GB. Màn hình Retina.',
                    target: 'Văn phòng',
                    factory: 'Apple',
                    categoryId: catOffice?.id
                },
                {
                    name: 'Dell XPS 13 Plus',
                    price: 45000000,
                    quantity: 5,
                    image: 'https://laptopvang.com/wp-content/uploads/2022/05/Dell-XPS-9320-1.jpg',
                    shortDesc: 'Đỉnh cao thiết kế doanh nhân.',
                    target: 'Văn phòng',
                    factory: 'Dell',
                    categoryId: catOffice?.id
                },
                // Điện Thoại
                {
                    name: 'iPhone 15 Pro Max',
                    price: 33000000,
                    quantity: 50,
                    image: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-titan-1-600x600.jpg',
                    shortDesc: 'Titanium tự nhiên, chip A17 Pro.',
                    target: 'Cao cấp',
                    factory: 'Apple',
                    categoryId: catPhone?.id
                },
                // Phụ kiện
                {
                    name: 'Chuột Logitech G Pro X',
                    price: 2500000,
                    quantity: 30,
                    image: 'https://product.hstatic.net/200000722513/product/g-pro-x-superlight-black-gallery-1_43878b66549c4021943015b63013de8f.png',
                    shortDesc: 'Chuột gaming không dây siêu nhẹ.',
                    target: 'Gaming',
                    factory: 'Logitech',
                    categoryId: catAccessory?.id
                }
            ],
        });
        console.log('✅ Đã tạo 6 sản phẩm mẫu Công nghệ');
    } else {
        console.log('ℹ️ Database đã có sản phẩm, bỏ qua bước tạo sản phẩm.');
    }
}

main()
    .catch((e) => {
        console.error('❌ Có lỗi khi seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });