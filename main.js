import express from 'express';
import dotenv from 'dotenv';
import mainRoute from './routes/index.js';

dotenv.config();
const PORT = process.env.PORT || 4005;

const app = express();
app.use(express.json());
app.use('/api', mainRoute);

app.use('/image', express.static('./uploads'));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});