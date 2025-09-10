import bcrypt from 'bcrypt';

/**
 * Generates a secure token hash using bcrypt
 * @param userId - ID of the user
 * @param topicId - ID of the topic
 * @param timestamp - Current timestamp
 * @returns Hashed string
 */
export async function generateTokenHash(userId: string, topicId: string, timestamp: string): Promise<string> {
  const data = `${userId}:${topicId}:${timestamp}`;
  const saltRounds = 10;

  const hash = await bcrypt.hash(data, saltRounds);
  return hash;
}
