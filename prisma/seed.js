// prisma/seed.js
console.log('!!! DEBUG: seed.js script is starting !!!');
const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Функція для створення повного набору категорій ТА страв для ОДНОГО ресторану
async function createFullMenuForRestaurant(restaurantId) {
    
    // 1. Створюємо 9 категорій для цього ресторану
    const categoriesData = [
        { name: 'Гарячі страви', restaurantId: restaurantId },
        { name: 'Супи', restaurantId: restaurantId },
        { name: 'Салати', restaurantId: restaurantId },
        { name: 'Піца', restaurantId: restaurantId },
        { name: 'Десерти', restaurantId: restaurantId },
        { name: 'Алкогольні напої', restaurantId: restaurantId },
        { name: 'Безалкогольні напої', restaurantId: restaurantId },
        { name: 'Кава', restaurantId: restaurantId },
        { name: 'Чай', restaurantId: restaurantId },
    ];
    
    // Використовуємо createMany, щоб уникнути N+1 запитів
    await prisma.category.createMany({
        data: categoriesData,
    });
    
    // Отримуємо ID щойно створених категорій
    const createdCategories = await prisma.category.findMany({
        where: { restaurantId: restaurantId },
    });
    
    // 2. Створюємо страви для кожної категорії
    const dishesData = [];
    for (const category of createdCategories) {
        // Додаємо 5 тестових страв для КОЖНОЇ категорії
        for (let i = 1; i <= 5; i++) {
            dishesData.push({
                name: `${category.name} - Страва ${i}`,
                description: `Опис для страви ${i} в категорії ${category.name}`,
                price: parseFloat((Math.random() * 300 + 50).toFixed(2)), // 50.00 - 350.00
                calories: Math.floor(Math.random() * 500 + 100), // 100 - 600
                imageUrl: '/images/placeholder.jpg', // Заглушка
                categoryId: category.id,
            });
        }
    }

    await prisma.dish.createMany({
        data: dishesData,
    });
}


async function main() {
    console.log('Start seeding ...');

    // --- 1. Чистимо старі дані ---
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.dish.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.restaurant.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.verificationToken.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Cleaned existing data.');


    // --- 2. Створюємо Власника та Клієнта ---
    const hashedPasswordOwner = await bcrypt.hash('123456', 10);
    const owner = await prisma.user.create({
        data: { email: 'owner@nazva.com', password: hashedPasswordOwner, role: Role.OWNER, name: 'Restaurant Owner' },
    });
    const hashedPasswordCustomer = await bcrypt.hash('password', 10);
    const customer = await prisma.user.create({
        data: { email: 'customer@test.com', password: hashedPasswordCustomer, role: Role.CUSTOMER, name: 'Test Customer' },
    });

    // --- 3. Створюємо РЕСТОРАНИ з вашими даними ---

    // 3.1. NAZVA
    const restaurant1 = await prisma.restaurant.create({
        data: {
            name: 'NAZVA',
            description: 'A warm and welcoming place for coffee lovers',
            bannerUrl: 'https://cdn-media.choiceqr.com/prod-eat-flat5/aXyIeko-egYJPqB-XimVTlX.jpeg.webp',
            logoUrl: 'https://instagram.fiev13-1.fna.fbcdn.net/v/t51.2885-19/327769289_3007771502857486_8282099528614906863_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby42MzEuYzIifQ&_nc_ht=instagram.fiev13-1.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QFcvi-HWTEUHg1H8XkDyB1D1TGvmxh9HrrDgnPJ-DNI3S2RGjXBtEhN8dY__K9RXJk&_nc_ohc=OZXgn3RuQ5sQ7kNvwE-3eaU&_nc_gid=JoCyTwrGiPW4WxJzR7lWag&edm=APoiHPcBAAAA&ccb=7-5&oh=00_Afd2c_UwlM-P7FhiAAT_arbhWDlE0NGmZbnooVwKcuXIZQ&oe=690589E3&_nc_sid=22de04',
            address: 'Львів, площа Ринок, 39',
            stars: 4.0, 
            ownerId: owner.id,
        },
    });
    
    // 3.2. BaboGarden
    const restaurant2 = await prisma.restaurant.create({
        data: {
            name: 'BaboGarden',
            description: 'Авторська кухня для тих, хто цінує досконалість.',
            bannerUrl: 'https://production.api.restaron.kitg.com.ua/public/lending/mainSlider/6889e150a96448e396c63ef2_image.jpg',
            logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxhSi80JciTaegv7WWgc1Tf088iTwII9XEhA&s',
            address: 'Львів, вулиця Сяйво 4',
            stars: 4.8, 
            ownerId: owner.id,
        },
    });

    // 3.3. Сицилійський дворик
    const restaurant3 = await prisma.restaurant.create({
        data: {
            name: 'Сицилійський дворик',
            description: 'Смак, що об’єднує людей за одним столом.',
            bannerUrl: 'https://posteat.ua/wp-content/uploads/2023/06/343418019_2150965938436876_1734399969313336000_n-1-1-1-min.jpg',
            logoUrl: 'https://instagram.fiev13-1.fna.fbcdn.net/v/t51.2885-19/334844354_227606193069043_7988247861179557118_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4zMjAuYzIifQ&_nc_ht=instagram.fiev13-1.fna.fbcdn.net&_nc_cat=107&_nc_oc=Q6cZ2QFxltBb_Nd0dCYcDvwz6KgaWK-c1rWYZC0s3h68WNdR04rstSsMl-5vfWo1Nh_kq-w&_nc_ohc=91qdvMXNm1sQ7kNvwHCu9L1&_nc_gid=gH2ZE0K5x55P-g5f-uHFcg&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_Afec2UcPzY4HtPbBUrqBNInbTUDEGLe-rJsAEA1aVFnw0A&oe=6905927B&_nc_sid=7d3ac5',
            address: 'Львів, вулиця Богдана Хмельницького, 20',
            stars: 3.5, 
            ownerId: owner.id,
        },
    });

    // 3.4. Пструг Хліб та вино
    const restaurant4 = await prisma.restaurant.create({
        data: {
            name: 'Пструг',
            description: 'Хліб та вино',
            bannerUrl: 'https://www.lvivconvention.com.ua/wp-content/uploads/2021/03/Pstruhkhlib-ta-vyno-nadano-festom-8-scaled.jpg',
            logoUrl: 'https://instagram.fiev13-1.fna.fbcdn.net/v/t51.2885-19/433138897_947732130234264_3521150477103078962_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fiev13-1.fna.fbcdn.net&_nc_cat=100&_nc_oc=Q6cZ2QHPbpK7PpbpJ635Q98dczS4zT2D8Dy0qHup27TB-JvWB48_gn6c9En-NyXbuV2A-iQ&_nc_ohc=p9X0Ck1RQRAQ7kNvwF7ETLB&_nc_gid=O9mIMwJ7qBYV1W6lTS4KnQ&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_Afd_fuFnbBPjchrnxSNspEAHUCqdQ4tivxCtajTnQrvVyg&oe=69057791&_nc_sid=7d3ac5',
            address: 'Львів, вулиця Братів Рогатинців, 49',
            stars: 5.0, 
            ownerId: owner.id,
        },
    });
    
    // 3.5. Grand Cafe Leopolis
    const restaurant5 = await prisma.restaurant.create({
        data: {
            name: 'Grand Cafe Leopolis',
            description: 'Де солодке стає моментом, який хочеться запам’ятати.',
            bannerUrl: 'https://cdn-ua.bodo.gift/resize/upload/gallery/4359/75013/original-t1600873204-r1w768h425q90zc1.jpg',
            logoUrl: 'https://instagram.fiev13-1.fna.fbcdn.net/v/t51.2885-19/56920379_280869406193507_7545156923637628928_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby45MDAuYzIifQ&_nc_ht=instagram.fiev13-1.fna.fbcdn.net&_nc_cat=111&_nc_oc=Q6cZ2QG4QSi8XYWRoHAQiaH9FO_NiHm_s9eekfe1JsHsKGDHQ3X4-9vqCQ2LvTCPLb5O1R0&_nc_ohc=rxGRa5VWpdIQ7kNvwGpY2I8&_nc_gid=ddA7-TnX0nNhZ_TC3lIXUA&edm=APoiHPcBAAAA&ccb=7-5&oh=00_AfdINbbXIFinpbXpPAMNN82yuu1OFTT-NTaJ89BYwBh6jw&oe=69058524&_nc_sid=22de04',
            address: 'Львів, площа Ринок, 15',
            stars: 5.0, 
            ownerId: owner.id,
        },
    });

    console.log('Created 5 main restaurants.');
    
    // --- 4. Створюємо меню для КОЖНОГО ресторану ---
    await createFullMenuForRestaurant(restaurant1.id);
    await createFullMenuForRestaurant(restaurant2.id);
    await createFullMenuForRestaurant(restaurant3.id);
    await createFullMenuForRestaurant(restaurant4.id);
    await createFullMenuForRestaurant(restaurant5.id);

    console.log('Created full menus for all restaurants.');
    console.log('Seeding finished.');
}

main()
    .catch(async (e) => {
        console.error('Error during seeding:', e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });