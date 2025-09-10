// Simple debug endpoint to test serverless function
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    res.status(200).json({
      message: 'Debug endpoint working!',
      method: req.method,
      body: req.body,
      env: {
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        hasNamecom: !!process.env.NAMECOM_USERNAME,
        nodeEnv: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Debug error',
      message: error.message,
      stack: error.stack
    });
  }
};
