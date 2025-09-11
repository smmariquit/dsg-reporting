import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import path from 'path';
dotenv.config();
// Initialize Firebase Admin SDK
const serviceAccountPath = path.join('dsg-reporting-e8d40-firebase-adminsdk-fbsvc-90d9993131.json');
console.log('Using service account path:', serviceAccountPath);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
});
const db = admin.firestore();
const app = express();
const port = process.env.PORT || 5000;
// Health check endpoint for API
app.get('/api', (req, res) => {
    res.json({ status: 'ok', message: 'API root is working' });
});
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('DSG Reporting API is running');
});
// Example route to test Firestore connection
app.get('/test-firestore', async (req, res) => {
    try {
        const snapshot = await db.collection('interviews').limit(1).get();
        res.json({ success: true, count: snapshot.size });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : error });
    }
});
// POST /api/interviews - Save interview data
app.post('/api/interviews', async (req, res) => {
    try {
        console.log('POST /api/interviews body:', req.body);
        const data = req.body;
        data.timestamp = admin.firestore.FieldValue.serverTimestamp();
        const result = await db.collection('interviews').add(data);
        console.log('Firestore write result:', result.id);
        res.status(201).json({ success: true });
    }
    catch (error) {
        console.error('Error in POST /api/interviews:', error);
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : error });
    }
});
// GET /api/interviews - Get all interview data
app.get('/api/interviews', async (req, res) => {
    try {
        const snapshot = await db.collection('interviews').get();
        const data = snapshot.docs.map(doc => doc.data());
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : error });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map