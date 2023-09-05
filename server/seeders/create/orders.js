const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://127.0.0.1:27017/furryfeetdesigns";

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function generateSeedData(year, month) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const products = await client.db("furryfeetdesigns").collection("products").find().toArray();
        const users = await client.db("furryfeetdesigns").collection("users").find().toArray();
        
        const statuses = ["pending", "shipped", "delivered"];
        const orders = [];

        for (let i = 1; i <= 100; i++) {
            const userId = users[Math.floor(Math.random() * users.length)]._id;
            const orderDate = randomDate(new Date(year, month - 1, 1), new Date(year, month, 0));
            
            const num_items = Math.floor(Math.random() * 4) + 1;
            const order_items = products.slice(0, num_items).map(product => ({
                productId: product._id,
                quantity: Math.floor(Math.random() * 11)
            }));
            
            const invoice_amount = order_items.reduce((sum, orderedProduct) => sum + ((orderedProduct.product?.price || 0) * orderedProduct.quantity), 0);

            
            const order = {
                userId,
                orderDate: orderDate.toISOString(),
                status: statuses[Math.floor(Math.random() * statuses.length)],
                products: order_items,
                invoice_amount: parseFloat(invoice_amount.toFixed(2))
            };

            orders.push(order);
        }

        await client.db("furryfeetdesigns").collection("orders").insertMany(orders);
        console.log("Orders seeded successfully");

    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        await client.close();
    }
}

// Generate seed data for multiple months
const year = 2023;
for (const month of [5, 6, 7, 8]) {  // May, June, July, August
    generateSeedData(year, month).catch(console.error);
}

