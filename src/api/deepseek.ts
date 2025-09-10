// @ts-nocheck
export const getDeepSeekResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('https://n8n-k6lq.onrender.com/webhook/deepseekapihandler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // ✅ Avoids preflight
      },
      body: JSON.stringify({ speechText: prompt }) // ✅ Send as raw string
    });

    const result: any = await response.json();

    // ✅ Adjust this based on n8n's output structure
    return result.data?.reply || result.reply || 'No response from DeepSeek';
  } catch (error) {
    console.error('Error calling DeepSeek via n8n:', error);
    return 'Error contacting AI service.';
  }
};
