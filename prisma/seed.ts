import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Bắt đầu tạo dữ liệu mẫu (Seeding)...');

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
            fullName: 'Quản Trị Viên Cao Cấp',
            roleId: roleAdmin.id,
            accountType: 'local',
            avatar: 'https://i.pravatar.cc/150?img=11',
            address: 'TP. Hồ Chí Minh',
            phone: '0909000111'
        },
    });

    console.log('✅ Đã tạo User Admin: admin / 123456');

    // --------------------------------------------------------
    // 3. TẠO DANH MỤC (CATEGORIES) - [MỚI]
    // --------------------------------------------------------
    // Tạo mảng danh mục mẫu
    const categoriesData = [
        { name: 'Thời trang Nam', description: 'Quần áo, phụ kiện dành cho nam giới' },
        { name: 'Thời trang Nữ', description: 'Đầm, váy, áo kiểu dành cho nữ' },
        { name: 'Giày Dép', description: 'Sneaker, giày tây, giày cao gót' },
        { name: 'Phụ kiện', description: 'Túi xách, ví, thắt lưng, nón' }
    ];

    // Lưu danh mục vào DB và lấy lại kết quả (để lấy ID)
    const createdCategories = [];

    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
        createdCategories.push(category);
    }

    console.log(`✅ Đã tạo ${createdCategories.length} Danh mục sản phẩm`);

    // --------------------------------------------------------
    // 4. TẠO SẢN PHẨM MẪU (PRODUCTS) - [ĐÃ CẬP NHẬT LIÊN KẾT]
    // --------------------------------------------------------
    const productCount = await prisma.product.count();

    if (productCount === 0) {
        // Lấy ID của các danh mục vừa tạo để gán cho sản phẩm
        const catNam = createdCategories.find(c => c.name === 'Thời trang Nam');
        const catNu = createdCategories.find(c => c.name === 'Thời trang Nữ');
        const catGiay = createdCategories.find(c => c.name === 'Giày Dép');

        await prisma.product.createMany({
            data: [
                {
                    name: 'Áo Thun Basic Cotton',
                    price: 150000,
                    quantity: 100,
                    image: 'https://placehold.co/600x400?text=Ao+Thun',
                    shortDesc: 'Áo thun form rộng, chất liệu cotton 100% thoáng mát.',
                    detailDesc: 'Mô tả chi tiết về áo thun: Thấm hút mồ hôi tốt...',
                    target: 'Nam',
                    factory: 'Việt Nam',
                    categoryId: catNam?.id // Liên kết với danh mục Nam
                },
                {
                    name: 'Đầm Hoa Nhí Vintage',
                    price: 350000,
                    quantity: 50,
                    image: 'https://placehold.co/600x400?text=Dam+Hoa',
                    shortDesc: 'Đầm voan hoa nhí, phong cách nhẹ nhàng.',
                    detailDesc: 'Thích hợp đi dạo phố, đi biển. Free size dưới 60kg.',
                    target: 'Nữ',
                    factory: 'Quảng Châu',
                    categoryId: catNu?.id // Liên kết với danh mục Nữ
                },
                {
                    name: 'Giày Sneaker Thể Thao',
                    price: 850000,
                    quantity: 20,
                    image: 'https://placehold.co/600x400?text=Sneaker',
                    shortDesc: 'Giày chạy bộ siêu nhẹ, êm chân.',
                    target: 'Unisex',
                    factory: 'Adidas VN',
                    categoryId: catGiay?.id // Liên kết với danh mục Giày
                }
            ],
        });
        console.log('✅ Đã tạo 3 sản phẩm mẫu có liên kết Danh mục');
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