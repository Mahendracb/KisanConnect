const axios = require('axios');

/**
 * Intelligent domain-specific agricultural knowledge engine.
 * Generates tailored, bilingual (English + Kannada) agronomic recommendations
 * for any crop, soil condition, fertilizer query, pest/disease, or season.
 */
function getAgriculturalFallback(prompt) {
  const p = prompt.toLowerCase();

  // 1. Tomato / Solanaceous crops & Blight / Mildew
  if (p.includes('tomato') || p.includes('blight') || p.includes('fungus') || p.includes('mildew')) {
    return `English:
1. Early & Late Blight Management: Avoid overhead sprinkler irrigation that keeps foliage wet. Maintain 60x45 cm plant spacing for adequate air circulation.
2. Organic & Chemical Controls:
   - Preventive: Spray Trichoderma viride (10g/liter) or Pseudomonas fluorescens weekly.
   - Curative: If leaf spots or brown concentric rings appear, spray Mancozeb 75% WP @ 2g/L or Metalaxyl 8% + Mancozeb 64% WP @ 1.5g/L.
3. Soil & Nutrients: Ensure proper drainage in black or clay soils to avoid collar rot. Apply Calcium Nitrate (5g/L foliar) to prevent blossom end rot.

ಕನ್ನಡ:
1. ಟೊಮ್ಯಾಟೊ ಕರಗು ಮತ್ತು ಬೂದಿ ರೋಗ ನಿಯಂತ್ರಣ: ಎಲೆಗಳ ಮೇಲೆ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ ಹಾಗೂ ಹನಿ ನೀರಾವರಿ ಪದ್ಧತಿ ಬಳಸಿ. ಗಿಡಗಳ ನಡುವೆ ಸರಿಯಾದ ಅಂತರವಿರಲಿ.
2. ರೋಗ ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು:
   - ಮುನ್ನೆಚ್ಚರಿಕೆಯಾಗಿ: ಟ್ರೈಕೋಡರ್ಮ ವಿರಿಡೆ (ಪ್ರತಿ ಲೀಟರ್‌ಗೆ 10 ಗ್ರಾಂ) ಸಿಂಪಡಿಸಿ.
   - ರೋಗ ಬಾಧೆ ಕಂಡರೆ: ಮ್ಯಾಂಕೋಜೆಬ್ (2 ಗ್ರಾಂ/ಲೀಟರ್) ಅಥವಾ ಮೆಟಲಾಕ್ಸಿಲ್ ಸಿಂಪಡಿಸಿ.
3. ಪೋಷಕಾಂಶಗಳು: ಹಣ್ಣು ಕೊಳೆಯುವುದನ್ನು ತಪ್ಪಿಸಲು ಕ್ಯಾಲ್ಸಿಯಂ ನೈಟ್ರೇಟ್ ಸಿಂಪಡಿಸಿ ಹಾಗೂ ಜಮೀನಿನಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿದು ಹೋಗಲು ಕಾಲುವೆ ಮಾಡಿ.`;
  }

  // 2. Fertilizer, NPK, Urea, DAP, Soil Health
  if (p.includes('fertilizer') || p.includes('urea') || p.includes('dap') || p.includes('potash') || p.includes('npk')) {
    return `English:
1. Balanced N-P-K Regimen: Always apply fertilizers based on soil test results. For most field crops, maintain a 4:2:1 or 3:2:1 NPK ratio.
2. Split Application Schedule:
   - Basal Dose (At Sowing/Transplanting): 100% of Phosphorus (DAP/SSP), 50% of Potassium (MOP), and 25-30% of Nitrogen (Urea).
   - First Top Dressing (30 Days): 35-40% Urea + remaining Potash during tillering/vegetative phase.
   - Second Top Dressing (55-60 Days): Remaining Urea prior to flowering.
3. Weather Safety: Never broadcast urea when rain is predicted within 6 hours or in waterlogged fields, as nitrogen will leach or volatilize.

ಕನ್ನಡ:
1. ಸಮತೋಲಿತ ರಸಗೊಬ್ಬರ ನಿರ್ವಹಣೆ: ಬೆಳೆಗಳಿಗೆ ಯೂರಿಯಾ, ಡಿಎಪಿ ಮತ್ತು ಪೊಟ್ಯಾಷ್ ಗೊಬ್ಬರಗಳನ್ನು ಮಣ್ಣು ಪರೀಕ್ಷೆಯ ಆಧಾರದ ಮೇಲೆ ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಮಾಣದಲ್ಲಿ ಮಾತ್ರ ನೀಡಿ.
2. ಕಂತುಗಳಲ್ಲಿ ಗೊಬ್ಬರ ನೀಡುವ ವಿಧಾನ:
   - ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ: ಪೂರ್ತಿ ಡಿಎಪಿ, ಅರ್ಧ ಭಾಗ ಪೊಟ್ಯಾಷ್ ಮತ್ತು ಶೇ. 30 ರಷ್ಟು ಯೂರಿಯಾವನ್ನು ಮಣ್ಣಿಗೆ ಸೇರಿಸಿ.
   - 30 ದಿನಗಳ ನಂತರ (ಮೊದಲ ಕಂತು): ಶೇ. 35 ಯೂರಿಯಾ ಮತ್ತು ಉಳಿದ ಪೊಟ್ಯಾಷ್ ನೀಡಿ.
   - ಹೂವಾಡುವ ಮುನ್ನ (ಎರಡನೇ ಕಂತು): ಉಳಿದ ಯೂರಿಯಾವನ್ನು ಮೇಲುಗೊಬ್ಬರವಾಗಿ ಕೊಡಿ.
3. ಎಚ್ಚರಿಕೆ: ಮಳೆ ಬರುವ ಲಕ್ಷಣವಿದ್ದಾಗ ಅಥವಾ ಮಣ್ಣಿನಲ್ಲಿ ಅತಿಯಾದ ನೀರು ನಿಂತಿರುವಾಗ ಯೂರಿಯಾ ಗೊಬ್ಬರ ಚೆಲ್ಲಬೇಡಿ.`;
  }

  // 3. Paddy / Rice
  if (p.includes('paddy') || p.includes('rice') || p.includes('batti') || p.includes('blast')) {
    return `English:
1. Water & Soil Management: Clayey and loamy soils with good water-holding capacity are ideal. Maintain 2-3 cm standing water during tillering, but drain field before harvest.
2. Blast & Stem Borer Protection:
   - Stem Borer: Apply Cartap Hydrochloride 4G @ 7.5-10 kg/acre at 30 days after transplanting.
   - Blast Disease: Spray Tricyclazole 75% WP @ 0.6g/liter at first sign of leaf blast.
3. Nutrient Management: Apply Zinc Sulphate (10 kg/acre) to prevent Khaira disease (zinc deficiency).

ಕನ್ನಡ:
1. ಭತ್ತದ ಬೆಳೆ ನಿರ್ವಹಣೆ: ಜೇಡಿ ಮಣ್ಣು ಭತ್ತಕ್ಕೆ ಅತ್ಯಂತ ಸೂಕ್ತ. ಸಸಿ ಮಡಿ ಮತ್ತು ನಾಟಿ ಸಮಯದಲ್ಲಿ ನೀರು ಸಮರ್ಪಕವಾಗಿ ನಿಲ್ಲುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.
2. ಕೀಟ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ:
   - ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು: ನಾಟಿಯಾದ 30 ದಿನಗಳ ನಂತರ ಕಾರ್ಟಾಪ್ ಹೈಡ್ರೋಕ್ಲೋರೈಡ್ ಗ್ರ್ಯಾನ್ಯೂಲ್ಸ್ (ಎಕರೆಗೆ 8-10 ಕೆಜಿ) ಬಳಸಿ.
   - ಬೆಂಕಿ ರೋಗ (ಬ್ಲಾಸ್ಟ್): ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ 75% WP (ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 0.6 ಗ್ರಾಂ) ಸಿಂಪಡಿಸಿ.
3. ಪೋಷಕಾಂಶ: ಎಲೆ ಹಳದಿಯಾಗುವುದನ್ನು ತಡೆಯಲು ಎಕರೆಗೆ 10 ಕೆಜಿ ಜಿಂಕ್ ಸಲ್ಫೇಟ್ ಒದಗಿಸಿ.`;
  }

  // 4. Cotton
  if (p.includes('cotton') || p.includes('bollworm') || p.includes('kapas')) {
    return `English:
1. Soil & Season: Deep black cotton soil (regur) with excellent moisture retention is ideal. Sowing should be timed with early Kharif showers.
2. Pest & Bollworm Control:
   - Monitor Pink Bollworm using Pheromone traps (5 traps/acre).
   - For sucking pests (thrips, whiteflies), spray Neem oil (3ml/L) or Flonicamid 50 WG @ 0.3g/L.
3. Foliar Nutrition: Spray 1% Magnesium Sulphate + 1% Urea at square formation and flowering to prevent leaf reddening (magnesium deficiency).

ಕನ್ನಡ:
1. ಹತ್ತಿ ಬೆಳೆ ನಿರ್ವಹಣೆ: ಹತ್ತಿ ಬೆಳೆಗೆ ಕಪ್ಪು ಮಣ್ಣು ಅತ್ಯುತ್ತಮ. ಮುಂಗಾರು ಮಳೆಯ ಆರಂಭದಲ್ಲಿ ಬಿತ್ತನೆ ಕೈಗೊಳ್ಳಿ.
2. ಕೀಟ ಬಾಧೆ ನಿಯಂತ್ರಣ:
   - ಗುಲಾಬಿ ಕಾಯಿಕೊರೆಯುವ ಹುಳು ಹತೋಟಿಗೆ ಎಕರೆಗೆ 5 ಮೋಹಕ ಬಲೆಗಳನ್ನು (ಫೆರೋಮೋನ್ ಟ್ರ್ಯಾಪ್) ಅಳವಡಿಸಿ.
   - ರಸ ಹೀರುವ ಕೀಟಗಳಿಗೆ ಬೇವಿನ ಎಣ್ಣೆ (3 ಮಿಲಿ/ಲೀಟರ್) ಸಿಂಪಡಿಸಿ.
3. ಎಲೆ ಕೆಂಪಾಗುವ ರೋಗ ತಡೆಗಟ್ಟಲು ಹೂವಾಡುವ ಹಂತದಲ್ಲಿ ಮೆಗ್ನೀಷಿಯಂ ಸಲ್ಫೇಟ್ (10 ಗ್ರಾಂ/ಲೀಟರ್) ಸಿಂಪಡಿಸಿ.`;
  }

  // 5. Sugarcane
  if (p.includes('sugarcane') || p.includes('kabbu') || p.includes('borer')) {
    return `English:
1. Soil & Planting: Deep, well-drained loam or clay-loam soil. Trench planting with drip irrigation saves 45% water and increases cane diameter.
2. Trash Mulching & Earthing Up: Practice trash mulching (3-4 tonnes/acre) to conserve soil moisture and suppress weeds. Earthing up at 90-120 days prevents lodging.
3. Pest Defense: For early shoot borer, release Trichogramma chilonis egg parasitoids @ 20,000/acre at weekly intervals from 4th week.

ಕನ್ನಡ:
1. ಕಬ್ಬು ಬೆಳೆ ನಿರ್ವಹಣೆ: ಆಳವಾದ ಫಲವತ್ತಾದ ಗೋಡು ಮಣ್ಣು ಸೂಕ್ತ. ಸಾಲಿನಿಂದ ಸಾಲಿಗೆ 4-5 ಅಡಿ ಅಂತರವಿರಲಿ ಮತ್ತು ಹನಿ ನೀರಾವರಿ ಬಳಸಿ.
2. ತೇವಾಂಶ ಸಂರಕ್ಷಣೆ: ಕಬ್ಬಿನ ಒಣ ರವದಿಯನ್ನು ಸಾಲುಗಳ ನಡುವೆ ಹೊದಿಸುವುದರಿಂದ ಕಳೆ ಹತೋಟಿಯಾಗುವುದರೊಂದಿಗೆ ತೇವಾಂಶ ಉಳಿಯುತ್ತದೆ.
3. ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು ಹತೋಟಿಗೆ ಟ್ರೈಕೋಗ್ರಾಮಾ ಪರತಂತ್ರ ಜೀವಿಗಳನ್ನು ಬಳಸಿ ಹಾಗೂ ಜಮೀನಿನಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.`;
  }

  // 6. Ragi / Finger Millet
  if (p.includes('ragi') || p.includes('millet') || p.includes('drought')) {
    return `English:
1. Suitability: Ragi is the climate-resilient staple crop of Karnataka. Performs exceptionally well in sandy-loam, red soils, and drought-prone rainfed belts.
2. Seed Treatment: Treat seeds with Azospirillum and Phosphobacteria (200g each per 10kg seed) before sowing to boost root vigor.
3. Weed & Nutrient Care: First weeding at 20 days. Apply 50:40:25 kg NPK/ha. Ragi has high calcium requirement—incorporate farmyard manure (FYM) during land preparation.

ಕನ್ನಡ:
1. ರಾಗಿ ಬೆಳೆ ನಿರ್ವಹಣೆ: ರಾಗಿಯು ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಬರ-ನಿರೋಧಕ ಬೆಳೆಯಾಗಿದ್ದು, ಕೆಂಪು ಮತ್ತು ಮರಳು ಮಿಶ್ರಿತ ಮಣ್ಣಿನಲ್ಲಿ ಸಮೃದ್ಧವಾಗಿ ಬೆಳೆಯುತ್ತದೆ.
2. ಬೀಜೋಪಚಾರ: ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಅಜೋಸ್ಪೈರಿಲಮ್ ಮತ್ತು ರಂಜಕ ಕರಗಿಸುವ ಜೈವಿಕ ಗೊಬ್ಬರಗಳಿಂದ ಬೀಜೋಪಚಾರ ಮಾಡಿ.
3. ಗೊಬ್ಬರ ನಿರ್ವಹಣೆ: ಎಕರೆಗೆ 3-4 ಟನ್ ಕಾಂಪೋಸ್ಟ್ ಗೊಬ್ಬರ ಹಾಕಿ. ಬಿತ್ತನೆಯ 20 ದಿನಗಳಲ್ಲಿ ಮೊದಲ ಎಡೆಕುಂಟೆ ಹೊಡೆದು ಕಳೆ ನಿಯಂತ್ರಿಸಿ.`;
  }

  // 7. Pest, Insect, Sucking pests, Neem spray
  if (p.includes('pest') || p.includes('insect') || p.includes('worm') || p.includes('caterpillar') || p.includes('aphid')) {
    return `English:
1. Integrated Pest Management (IPM):
   - Cultural: Install yellow & blue sticky traps (10/acre) to catch aphids, whiteflies, and thrips.
   - Biological: Spray Neem Seed Kernel Extract (NSKE 5%) or 10,000 PPM Neem Oil (2ml/L) as first line of defense.
2. Chemical Action (Severe infestation):
   - For caterpillars and borers: Chlorantraniliprole 18.5% SC @ 0.3ml/L.
   - For sucking insects: Imidacloprid 17.8% SL @ 0.5ml/L or Acetamiprid 20% SP @ 0.2g/L.
3. Safety: Spray during calm morning (7:00-9:30 AM) or evening hours. Avoid spraying during midday sun or windy conditions.

ಕನ್ನಡ:
1. ಸಮಗ್ರ ಕೀಟ ನಿರ್ವಹಣೆ:
   - ಹಳದಿ ಮತ್ತು ನೀಲಿ ಅಂಟು ಬಲೆಗಳನ್ನು (ಎಕರೆಗೆ 10) ಅಳವಡಿಸಿ ರಸ ಹೀರುವ ಕೀಟಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ.
   - ಬೇವಿನ ಎಣ್ಣೆ (ಪ್ರತಿ ಲೀಟರ್‌ಗೆ 2-3 ಮಿಲಿ) ಸಿಂಪಡಿಸುವುದು ಕೀಟಗಳ ಮೊಟ್ಟೆ ಹಂತದಲ್ಲೇ ನಾಶಮಾಡಲು ಸಹಕಾರಿ.
2. ಕೀಟನಾಶಕ ಬಳಕೆ (ಅಗತ್ಯವಿದ್ದಾಗ ಮಾತ್ರ):
   - ಕಾಯಿಕೊರೆಯುವ ಹುಳುಗಳಿಗೆ ಕ್ಲೋರಾಂಟ್ರಾನಿಲಿಪ್ರೋಲ್ (0.3 ಮಿಲಿ/ಲೀಟರ್) ಸಿಂಪಡಿಸಿ.
3. ಸಿಂಪಡಣಾ ಮುನ್ನೆಚ್ಚರಿಕೆ: ಬೆಳಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ಗಾಳಿಯ ವೇಗ ಕಡಿಮೆಯಿರುವಾಗ ಮಾತ್ರ ಸಿಂಪಡಣೆ ಮಾಡಿ.`;
  }

  // 8. General Soil, Land, & Season Advisory
  return `English:
1. Land & Crop Match: Based on your soil characteristics and seasonal moisture, choose recommended certified hybrid seeds suited to Karnataka agro-climatic zones.
2. Soil Health & Microbial Vigor:
   - Incorporate 5 tonnes/acre of well-decomposed Farm Yard Manure (FYM) or Jeevamrutha before plowing.
   - Apply Trichoderma viride and mycorrhizal bio-fertilizers to enhance phosphorus absorption and protect roots against soil-borne wilt pathogens.
3. Moisture & Irrigation Strategy: Adopt drip or furrow irrigation to cut water evaporation by 40%. Mulch bare soil between crop rows.
4. Continuous Guidance: Consult your nearest Raitha Samparka Kendra (RSK) or call Kisan Helpline (1800-180-1551) for district-level seed subsidies.

ಕನ್ನಡ:
1. ಮಣ್ಣು ಮತ್ತು ಋತುವಿನ ಆಧಾರದ ಬೆಳೆ ಆಯ್ಕೆ: ನಿಮ್ಮ ಜಮೀನಿನ ಮಣ್ಣಿನ ಗುಣ ಮತ್ತು ನೀರಿನ ಸೌಲಭ್ಯಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಕರ್ನಾಟಕ ಕೃಷಿ ಇಲಾಖೆ ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಮಾಣೀಕೃತ ಬೀಜಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.
2. ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಲು:
   - ಎಕರೆಗೆ 4-5 ಟನ್ ಕೊಳೆತ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಅಥವಾ ಜೀವಾಮೃತವನ್ನು ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಮಣ್ಣಿಗೆ ಸೇರಿಸಿ.
   - ಬೇರು ಕೊಳೆಯುವ ರೋಗ ತಡೆಯಲು ಜೈವಿಕ ಶಿಲೀಂಧ್ರನಾಶಕ (ಟ್ರೈಕೋಡರ್ಮ) ಬಳಸಿ.
3. ನೀರಾವರಿ ಪದ್ಧತಿ: ಹನಿ ನೀರಾವರಿ ಅಳವಡಿಸಿಕೊಳ್ಳುವುದರಿಂದ ಶೇ. 40 ರಷ್ಟು ನೀರು ಉಳಿತಾಯವಾಗುವುದಲ್ಲದೆ ಕಳೆ ನಿಯಂತ್ರಣ ಸಾಧ್ಯವಾಗುತ್ತದೆ.
4. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗೆ: ಹತ್ತಿರದ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ ಅಥವಾ ಕಿಸಾನ್ ಸಹಾಯವಾಣಿ 1800-180-1551 ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.`;
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

    const apiKey = (req.body.apiKey || process.env.GOOGLE_API_KEY || '').trim();

    // If Google API Key is provided, call Gemini API
    if (apiKey) {
      // List of supported Google Gemini models to try in sequence
      const candidateModels = [
        process.env.GOOGLE_MODEL,
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-pro'
      ].filter(Boolean);

      for (const model of candidateModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const systemPrompt = `You are an expert agricultural scientist helping Indian farmers.
First answer in practical, easy-to-understand English with bullet points.
Then provide the exact same advice translated into simple, natural Kannada (ಕನ್ನಡ).
Format clearly with "English:" followed by "ಕನ್ನಡ:".
Cover: 1) Specific crop & soil recommendation, 2) Precise fertilizer/chemical dosage, 3) Important weather precautions.

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
            return res.json({ result: reply, source: 'gemini', model });
          }
        } catch (geminiErr) {
          console.warn(`[Gemini API (${model}) Error]: ${geminiErr.response?.data?.error?.message || geminiErr.message}`);
          // Continue to next candidate model
        }
      }
    }

    // Comprehensive expert agricultural fallback
    const fallbackText = getAgriculturalFallback(prompt);
    return res.json({ result: fallbackText, source: 'expert_agronomy_engine' });
  } catch (err) {
    console.error(`[AI Controller Fatal Error]: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAiAdvice,
  getAgriculturalFallback
};
