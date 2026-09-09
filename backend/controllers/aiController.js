const axios = require('axios');

// Intelligent offline agricultural knowledge base (fallback)
function getAgriculturalFallback(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes('fertilizer') || p.includes('urea') || p.includes('dap')) {
    return `English:
For balanced crop nutrition, apply N-P-K in recommended ratios. Apply Urea in split doses: one-third at sowing, one-third after 30 days, and the final dose during flowering. Avoid excess nitrogen during cloudy weather.

ಕನ್ನಡ:
ಬೆಳೆಗಳಿಗೆ ಸಮತೋಲಿತ ಪೋಷಕಾಂಶ ಒದಗಿಸಲು ಯೂರಿಯಾ, ಡಿಎಪಿ ಮತ್ತು ಪೊಟ್ಯಾಷ್ ಸರಿಯಾದ ಪ್ರಮಾಣದಲ್ಲಿ ಬಳಸಿ. ಯೂರಿಯಾವನ್ನು ಒಟ್ಟಿಗೆ ಹಾಕದೆ ಮೂರು ಕಂತುಗಳಲ್ಲಿ (ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ, 30 ದಿನಗಳ ನಂತರ ಮತ್ತು ಹೂವಾಡುವ ಹಂತದಲ್ಲಿ) ನೀಡಿ.`;
  }

  if (p.includes('tomato') || p.includes('blight') || p.includes('fungus')) {
    return `English:
To prevent early and late blight in tomato, avoid sprinkler irrigation that wets leaves. Spray Mancozeb (2g/liter) or bio-fungicide Trichoderma viride. Maintain proper spacing for air circulation.

ಕನ್ನಡ:
ಟೊಮ್ಯಾಟೊ ಬೆಳೆಯಲ್ಲಿ ಬೂದಿ ರೋಗ ಮತ್ತು ಕರಗು ರೋಗ ತಡೆಗಟ್ಟಲು ಗಿಡಗಳ ಬುಡಕ್ಕೆ ಹನಿ ನೀರಾವರಿ ಬಳಸಿ. ಎಲೆಗಳ ಮೇಲೆ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ. ಮ್ಯಾಂಕೋಜೆಬ್ (ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 2 ಗ್ರಾಂ) ಅಥವಾ ಟ್ರೈಕೋಡರ್ಮ ಸಿಂಪಡಿಸಿ.`;
  }

  return `English:
Ensure proper soil testing before planting. Choose crop varieties suited to your soil type and water availability. Practice drip irrigation to conserve water and apply bio-fertilizers to enhance soil microbes.

ಕನ್ನಡ:
ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿಸಿ. ನಿಮ್ಮ ಜಮೀನಿನ ಮಣ್ಣು ಮತ್ತು ನೀರಿನ ಲಭ್ಯತೆಗೆ ಅನುಗುಣವಾದ ಬೆಳೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಹನಿ ನೀರಾವರಿ ಪದ್ಧತಿ ಅಳವಡಿಸಿ ಹಾಗೂ ಜೈವಿಕ ಗೊಬ್ಬರಗಳನ್ನು ಬಳಸಿ ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಿ.`;
}

// @desc    Get bilingual AI crop advisory
// @route   POST /api/ai/text
// @access  Public / OptionalProtect
const getAiAdvice = async (req, res) => {
  try {
    const prompt = (req.body.prompt || '').trim();
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    // If Google API Key is provided, call Gemini API
    if (apiKey) {
      try {
        const model = process.env.GOOGLE_MODEL || 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const systemPrompt = `You are an expert agricultural scientist helping Indian farmers.
First answer in simple English.
Then provide the same answer in simple Kannada (ಕನ್ನಡ).
Keep both answers short, practical, and easy to understand. Avoid overly technical jargon.

Question:
${prompt}`;

        const response = await axios.post(
          url,
          {
            contents: [{ parts: [{ text: systemPrompt }] }]
          },
          { headers: { 'Content-Type': 'application/json' }, timeout: 12000 }
        );

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return res.json({ result: reply });
        }
      } catch (geminiErr) {
        console.warn(`[Gemini API Error, using expert fallback]: ${geminiErr.message}`);
      }
    }

    // Fallback response
    const fallbackText = getAgriculturalFallback(prompt);
    return res.json({ result: fallbackText });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAiAdvice
};
