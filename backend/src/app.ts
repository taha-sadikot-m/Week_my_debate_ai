
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createTokenHash } from './routes/createTokenHash';
import { deepseekChat } from './routes/deepseek';
import { deepseekWebhook } from './routes/deepseekWebhook';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Existing token route (unchanged)
app.post('/api/create-token', createTokenHash);

// ✅ Add DeepSeek POST route
app.post('/api/deepseek', deepseekChat);

// ✅ Add DeepSeek Webhook route
app.post('/api/deepseek-webhook', deepseekWebhook);

// Default route
app.get('/', (_req, res) => {
  res.send('Backend is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
