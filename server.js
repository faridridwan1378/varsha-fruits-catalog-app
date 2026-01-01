const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage (in production, use a database)
let userData = {};

// Helper function to get or create user ID
function getUserId(req) {
    let userId = req.headers['x-user-id'];
    if (!userId) {
        userId = uuidv4();
    }
    return userId;
}

// Routes for cart data
app.get('/api/cart', (req, res) => {
    const userId = getUserId(req);
    const cart = userData[userId]?.cart || [];
    res.json({ cart, userId });
});

app.post('/api/cart', (req, res) => {
    const userId = getUserId(req);
    if (!userData[userId]) userData[userId] = {};
    userData[userId].cart = req.body.cart || [];
    res.json({ success: true, userId });
});

app.put('/api/cart', (req, res) => {
    const userId = getUserId(req);
    if (!userData[userId]) userData[userId] = { cart: [] };
    userData[userId].cart = req.body.cart || userData[userId].cart;
    res.json({ success: true, userId });
});

app.delete('/api/cart', (req, res) => {
    const userId = getUserId(req);
    if (userData[userId]) {
        userData[userId].cart = [];
    }
    res.json({ success: true, userId });
});

// Routes for settings data
app.get('/api/settings', (req, res) => {
    const userId = getUserId(req);
    const settings = userData[userId]?.settings || {
        waNumber: '6281234567890',
        pin: '1234',
        logo: {
            image: '',
            title: 'Varsha',
            subtitle: 'Fruits & Goods'
        },
        hero: {
            title: 'Selamat Datang! 👋',
            description: 'Buah segar & berkualitas langsung dari kebun ke rumah Anda',
            buttonText: 'Lihat Katalog'
        }
    };
    res.json({ settings, userId });
});

app.post('/api/settings', (req, res) => {
    const userId = getUserId(req);
    if (!userData[userId]) userData[userId] = {};
    userData[userId].settings = req.body.settings || {};
    res.json({ success: true, userId });
});

app.put('/api/settings', (req, res) => {
    const userId = getUserId(req);
    if (!userData[userId]) userData[userId] = { settings: {} };
    userData[userId].settings = { ...userData[userId].settings, ...req.body.settings };
    res.json({ success: true, userId });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
