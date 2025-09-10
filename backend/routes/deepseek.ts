import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const deepseekChat = async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173', // your dev client URL
          'X-Title': 'MyDebate.ai',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || 'No response';
    res.json({ reply });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    res.status(500).json({ error: 'Failed to get response from DeepSeek' });
  }
};
