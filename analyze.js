// api/analyze.js
// Vercel Serverless Function to call Gemini API securely

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pdfData, fileName } = req.body;
  // Support for multiple keys as seen in your Vercel settings
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY01,
    process.env.GEMINI_API_KEY02
  ].filter(k => k); // Remove any that are undefined

  const apiKey = keys[Math.floor(Math.random() * keys.length)];

  if (!apiKey) {
    return res.status(500).json({ error: 'No Gemini API keys found in server environment' });
  }

  try {
    // This is where you call the real Gemini API
    // We'll use the Gemini 1.5 Flash REST API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `Analyze this exam paper: ${fileName}. Extract topic weightages and predict important questions. Return JSON only.` },
            { inline_data: { mime_type: 'application/pdf', data: pdfData } }
          ]
        }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });

    const data = await response.json();
    
    // Check for Gemini errors
    if (data.error) {
        throw new Error(data.error.message);
    }

    // Return the AI's analysis back to the browser
    return res.status(200).json(data);

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return res.status(500).json({ error: 'Analysis failed: ' + error.message });
  }
}
