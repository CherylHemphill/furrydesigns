const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const uri = "mongodb://127.0.0.1:27017/furryfeetdesigns";
const userLoops = 100;

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function generateUserData() {
    try {
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        await client.connect();
        
        const users = [];

        // Admin user
        const hashedAdminPassword = await hashPassword('admin123');
        users.push({
            _id: uuidv4(),
            name: 'Admin',
            email: 'admin@example.com',
            password: hashedAdminPassword,
            isAdmin: true
        });

        // Generate regular users
        for (let i = 1; i <= userLoops; i++) {
            const hashedPassword = await hashPassword(`user${i}pass`);
            const randomNum = Math.floor(Math.random() * 50) + 1;
            const isAdmin = randomNum === 1;

            const user = {
                _id: uuidv4(),
                name: `User${i}`,
                email: `user${i}@example.com`,
                password: hashedPassword,
                isAdmin
            };

            users.push(user);
        }

        await client.db("furryfeetdesigns").collection("users").insertMany(users);
        await client.close();
        
        console.log('User data seeded to MongoDB successfully.');
    } catch (error) {
        console.error('Error seeding user data:', error);
    }
}

generateUserData();

