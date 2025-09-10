import { Request, Response } from 'express';
import { generateTokenHash } from '../utils/generateTokenHash.js';

/**
 * Route handler to create a secure token hash
 */
export const createTokenHash = async (req: Request, res: Response) => {
  try {
    const { userId, topicId } = req.body;

    if (!userId || !topicId) {
      return res.status(400).json({
        error: true,
        message: 'Missing required fields: userId or topicId',
      });
    }

    const timestamp = Date.now().toString();
    const hash = await generateTokenHash(userId, topicId, timestamp);

    return res.status(200).json({
      success: true,
      data: {
        userId,
        topicId,
        timestamp,
        hash,
      },
    });
  } catch (error) {
    console.error('Error generating token hash:', error);
    return res.status(500).json({
      error: true,
      message: 'Internal server error while generating token hash',
    });
  }
};
