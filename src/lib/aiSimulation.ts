// AI Simulation Module
// This simulates AI responses for the frontend demo
// In production, these would be API calls to a Flask/FastAPI backend with real ML models

export interface CropRecommendationInput {
  soilType: string;
  season: string;
  temperature: number;
  rainfall: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface CropRecommendationResult {
  crop: string;
  confidence: number;
  reason: string;
  irrigation: string;
  fertilizer: string;
}

export interface DiseaseDetectionResult {
  disease: string;
  confidence: number;
  isHealthy: boolean;
  treatment: string;
  prevention: string;
}

// Crop recommendation knowledge base (simulates Decision Tree / Random Forest logic)
const cropDatabase: Record<string, {
  soilTypes: string[];
  seasons: string[];
  tempRange: [number, number];
  rainfallRange: [number, number];
  phRange: [number, number];
  irrigation: { en: string; ta: string };
  fertilizer: { en: string; ta: string };
}> = {
  'Rice (நெல்)': {
    soilTypes: ['alluvial', 'clay', 'black'],
    seasons: ['kharif'],
    tempRange: [20, 35],
    rainfallRange: [1000, 2000],
    phRange: [5.5, 7.0],
    irrigation: {
      en: 'Requires standing water during vegetative growth. Maintain 2-5 cm water level. Drain field 15 days before harvest.',
      ta: 'வளர்ச்சி காலத்தில் நிற்கும் நீர் தேவை. 2-5 செ.மீ நீர் மட்டத்தை பராமரிக்கவும். அறுவடைக்கு 15 நாட்களுக்கு முன் வயலை வடிகட்டவும்.',
    },
    fertilizer: {
      en: 'Apply NPK 120:60:60 kg/ha. Split nitrogen in 3 doses: basal, tillering, panicle initiation.',
      ta: 'NPK 120:60:60 கிலோ/ஹெக்டேர் இடவும். நைட்ரஜனை 3 தவணைகளாக பிரிக்கவும்: அடிப்படை, தூர் பிரிதல், கதிர் தொடக்கம்.',
    },
  },
  'Sugarcane (கரும்பு)': {
    soilTypes: ['alluvial', 'black', 'red'],
    seasons: ['kharif', 'zaid'],
    tempRange: [25, 38],
    rainfallRange: [750, 1500],
    phRange: [6.0, 8.0],
    irrigation: {
      en: 'Furrow irrigation every 7-10 days. Critical stages: germination, tillering, grand growth.',
      ta: 'ஒவ்வொரு 7-10 நாட்களுக்கும் பள்ள நீர்ப்பாசனம். முக்கிய நிலைகள்: முளைப்பு, தூர் பிரிதல், பெரு வளர்ச்சி.',
    },
    fertilizer: {
      en: 'Apply NPK 250:100:120 kg/ha. Apply nitrogen in 3 splits at 30, 60, and 90 days.',
      ta: 'NPK 250:100:120 கிலோ/ஹெக்டேர் இடவும். நைட்ரஜனை 30, 60, 90 நாட்களில் 3 தவணைகளாக இடவும்.',
    },
  },
  'Cotton (பருத்தி)': {
    soilTypes: ['black', 'alluvial'],
    seasons: ['kharif'],
    tempRange: [21, 35],
    rainfallRange: [600, 1000],
    phRange: [6.0, 8.0],
    irrigation: {
      en: 'Drip irrigation recommended. Water every 5-7 days during flowering and boll formation.',
      ta: 'சொட்டு நீர்ப்பாசனம் பரிந்துரைக்கப்படுகிறது. பூக்கும் மற்றும் காய் உருவாகும் நேரத்தில் ஒவ்வொரு 5-7 நாட்களுக்கும் நீர் பாய்ச்சவும்.',
    },
    fertilizer: {
      en: 'Apply NPK 120:60:60 kg/ha. Foliar spray of 2% DAP at flowering improves yield.',
      ta: 'NPK 120:60:60 கிலோ/ஹெக்டேர் இடவும். பூக்கும் நேரத்தில் 2% DAP இலைவழி தெளிப்பு மகசூலை மேம்படுத்தும்.',
    },
  },
  'Groundnut (நிலக்கடலை)': {
    soilTypes: ['sandy', 'red', 'laterite'],
    seasons: ['kharif', 'rabi'],
    tempRange: [25, 35],
    rainfallRange: [500, 750],
    phRange: [6.0, 7.0],
    irrigation: {
      en: 'Light irrigation at pegging and pod development. Avoid waterlogging.',
      ta: 'ஊசிப்போடும் மற்றும் காய் வளர்ச்சி நேரத்தில் லேசான நீர்ப்பாசனம். நீர் தேக்கத்தை தவிர்க்கவும்.',
    },
    fertilizer: {
      en: 'Apply NPK 25:50:75 kg/ha. Gypsum 500 kg/ha at flowering for better pod filling.',
      ta: 'NPK 25:50:75 கிலோ/ஹெக்டேர் இடவும். சிறந்த காய் நிரம்புதலுக்கு பூக்கும் நேரத்தில் ஜிப்சம் 500 கிலோ/ஹெக்டேர் இடவும்.',
    },
  },
  'Maize (மக்காச்சோளம்)': {
    soilTypes: ['alluvial', 'red', 'black'],
    seasons: ['kharif', 'rabi'],
    tempRange: [21, 32],
    rainfallRange: [600, 1000],
    phRange: [5.5, 7.5],
    irrigation: {
      en: 'Irrigate at knee-high, tasseling, and grain filling stages. Avoid water stress during silking.',
      ta: 'முழங்கால் உயரம், பூங்கொத்து, தானிய நிரம்புதல் நிலைகளில் நீர் பாய்ச்சவும். பட்டு நிலையில் நீர் பற்றாக்குறையை தவிர்க்கவும்.',
    },
    fertilizer: {
      en: 'Apply NPK 180:80:60 kg/ha. Split nitrogen: 1/3 basal, 1/3 at knee-high, 1/3 at tasseling.',
      ta: 'NPK 180:80:60 கிலோ/ஹெக்டேர் இடவும். நைட்ரஜன் பிரிப்பு: 1/3 அடிப்படை, 1/3 முழங்கால் உயரத்தில், 1/3 பூங்கொத்தில்.',
    },
  },
  'Wheat (கோதுமை)': {
    soilTypes: ['alluvial', 'clay', 'black'],
    seasons: ['rabi'],
    tempRange: [15, 25],
    rainfallRange: [400, 750],
    phRange: [6.0, 8.0],
    irrigation: {
      en: 'Critical irrigations: crown root, tillering, flowering, grain filling. 4-5 irrigations needed.',
      ta: 'முக்கிய நீர்ப்பாசனங்கள்: கிரீட வேர், தூர் பிரிதல், பூக்குதல், தானிய நிரம்புதல். 4-5 நீர்ப்பாசனங்கள் தேவை.',
    },
    fertilizer: {
      en: 'Apply NPK 120:60:40 kg/ha. Apply full P and K as basal, nitrogen in 2-3 splits.',
      ta: 'NPK 120:60:40 கிலோ/ஹெக்டேர் இடவும். முழு P மற்றும் K அடிப்படையாக, நைட்ரஜன் 2-3 தவணைகளாக இடவும்.',
    },
  },
  'Tomato (தக்காளி)': {
    soilTypes: ['red', 'alluvial', 'sandy'],
    seasons: ['rabi', 'zaid'],
    tempRange: [18, 30],
    rainfallRange: [400, 600],
    phRange: [6.0, 7.0],
    irrigation: {
      en: 'Drip irrigation preferred. Water every 3-4 days. Maintain uniform moisture during fruiting.',
      ta: 'சொட்டு நீர்ப்பாசனம் விரும்பப்படுகிறது. ஒவ்வொரு 3-4 நாட்களுக்கும் நீர் பாய்ச்சவும். காய்க்கும் நேரத்தில் சீரான ஈரப்பதத்தை பராமரிக்கவும்.',
    },
    fertilizer: {
      en: 'Apply NPK 150:100:100 kg/ha. Calcium nitrate spray to prevent blossom end rot.',
      ta: 'NPK 150:100:100 கிலோ/ஹெக்டேர் இடவும். பூ முனை அழுகலை தடுக்க கால்சியம் நைட்ரேட் தெளிப்பு.',
    },
  },
  'Banana (வாழை)': {
    soilTypes: ['alluvial', 'clay', 'red'],
    seasons: ['kharif', 'rabi', 'zaid'],
    tempRange: [25, 35],
    rainfallRange: [1200, 2000],
    phRange: [6.0, 7.5],
    irrigation: {
      en: 'Basin or drip irrigation. Irrigate every 3-4 days in summer, weekly in winter.',
      ta: 'வட்ட அல்லது சொட்டு நீர்ப்பாசனம். கோடையில் ஒவ்வொரு 3-4 நாட்களுக்கும், குளிர்காலத்தில் வாரந்தோறும் நீர் பாய்ச்சவும்.',
    },
    fertilizer: {
      en: 'Apply NPK 200:60:300 g/plant. Apply in 5 splits from 2nd to 7th month.',
      ta: 'NPK 200:60:300 கிராம்/செடி இடவும். 2வது முதல் 7வது மாதம் வரை 5 தவணைகளாக இடவும்.',
    },
  },
  'Coconut (தென்னை)': {
    soilTypes: ['sandy', 'laterite', 'alluvial'],
    seasons: ['kharif', 'rabi', 'zaid'],
    tempRange: [25, 35],
    rainfallRange: [1000, 2500],
    phRange: [5.5, 8.0],
    irrigation: {
      en: 'Basin irrigation with 40-50 liters per palm every 4-5 days. Drip irrigation saves 40% water.',
      ta: 'ஒவ்வொரு 4-5 நாட்களுக்கும் ஒரு மரத்திற்கு 40-50 லிட்டர் வட்ட நீர்ப்பாசனம். சொட்டு நீர்ப்பாசனம் 40% நீரை சேமிக்கிறது.',
    },
    fertilizer: {
      en: 'Apply NPK 1.3:0.65:1.3 kg/palm/year. Apply organic manure 50 kg/palm.',
      ta: 'NPK 1.3:0.65:1.3 கிலோ/மரம்/வருடம் இடவும். 50 கிலோ/மரம் இயற்கை உரம் இடவும்.',
    },
  },
  'Mango (மாம்பழம்)': {
    soilTypes: ['alluvial', 'red', 'laterite'],
    seasons: ['kharif'],
    tempRange: [24, 35],
    rainfallRange: [750, 1500],
    phRange: [5.5, 7.5],
    irrigation: {
      en: 'Young trees: weekly irrigation. Mature trees: irrigation at flowering and fruit development.',
      ta: 'இளம் மரங்கள்: வாராந்திர நீர்ப்பாசனம். முதிர்ந்த மரங்கள்: பூக்கும் மற்றும் பழ வளர்ச்சியில் நீர்ப்பாசனம்.',
    },
    fertilizer: {
      en: 'Apply NPK 1:0.5:1 kg/tree for bearing trees. Increase with age.',
      ta: 'காய்க்கும் மரங்களுக்கு NPK 1:0.5:1 கிலோ/மரம் இடவும். வயதுக்கேற்ப அதிகரிக்கவும்.',
    },
  },
};

// Translations for dynamic content
const soilNames = {
  en: {
    alluvial: 'Alluvial soil',
    black: 'Black cotton soil',
    red: 'Red soil',
    laterite: 'Laterite soil',
    sandy: 'Sandy soil',
    clay: 'Clay soil',
  },
  ta: {
    alluvial: 'வண்டல் மண்',
    black: 'கருப்பு பருத்தி மண்',
    red: 'சிவப்பு மண்',
    laterite: 'லேட்டரைட் மண்',
    sandy: 'மணல் மண்',
    clay: 'களிமண்',
  },
};

const seasonNames = {
  en: {
    kharif: 'Kharif (monsoon)',
    rabi: 'Rabi (winter)',
    zaid: 'Zaid (summer)',
  },
  ta: {
    kharif: 'காரிஃப் (பருவமழை)',
    rabi: 'ரபி (குளிர்காலம்)',
    zaid: 'ஜைத் (கோடை)',
  },
};

const reasonTemplates = {
  en: (crop: string, soilName: string, ph: number, seasonName: string, temperature: number, rainfall: number, nitrogen: number, phosphorus: number, potassium: number) =>
    `${crop.split(' ')[0]} is recommended because your ${soilName} with pH ${ph} is ideal for this crop. The ${seasonName} season with ${temperature}°C temperature and ${rainfall}mm rainfall provides optimal growing conditions. The NPK levels (N: ${nitrogen}, P: ${phosphorus}, K: ${potassium} kg/ha) support healthy growth.`,
  ta: (crop: string, soilName: string, ph: number, seasonName: string, temperature: number, rainfall: number, nitrogen: number, phosphorus: number, potassium: number) =>
    `உங்கள் ${soilName} மற்றும் pH ${ph} இந்த பயிருக்கு ஏற்றது என்பதால் ${crop.split('(')[1]?.replace(')', '') || crop.split(' ')[0]} பரிந்துரைக்கப்படுகிறது. ${seasonName} பருவம் ${temperature}°C வெப்பநிலை மற்றும் ${rainfall} மி.மீ மழைப்பொழிவுடன் சிறந்த வளர்ச்சி நிலைமைகளை வழங்குகிறது. NPK அளவுகள் (N: ${nitrogen}, P: ${phosphorus}, K: ${potassium} கிலோ/ஹெக்டேர்) ஆரோக்கியமான வளர்ச்சியை ஆதரிக்கின்றன.`,
};

export function simulateCropRecommendation(input: CropRecommendationInput, language: 'en' | 'ta' = 'en'): CropRecommendationResult {
  let bestCrop = '';
  let bestScore = 0;
  let bestData = cropDatabase['Rice (நெல்)'];

  for (const [crop, data] of Object.entries(cropDatabase)) {
    let score = 0;

    // Soil type match (weight: 30)
    if (data.soilTypes.includes(input.soilType)) {
      score += 30;
    }

    // Season match (weight: 25)
    if (data.seasons.includes(input.season)) {
      score += 25;
    }

    // Temperature match (weight: 15)
    if (input.temperature >= data.tempRange[0] && input.temperature <= data.tempRange[1]) {
      score += 15;
    } else if (Math.abs(input.temperature - data.tempRange[0]) < 5 || Math.abs(input.temperature - data.tempRange[1]) < 5) {
      score += 8;
    }

    // Rainfall match (weight: 15)
    if (input.rainfall >= data.rainfallRange[0] && input.rainfall <= data.rainfallRange[1]) {
      score += 15;
    } else if (Math.abs(input.rainfall - data.rainfallRange[0]) < 200 || Math.abs(input.rainfall - data.rainfallRange[1]) < 200) {
      score += 8;
    }

    // pH match (weight: 15)
    if (input.ph >= data.phRange[0] && input.ph <= data.phRange[1]) {
      score += 15;
    } else if (Math.abs(input.ph - data.phRange[0]) < 0.5 || Math.abs(input.ph - data.phRange[1]) < 0.5) {
      score += 8;
    }

    if (score > bestScore) {
      bestScore = score;
      bestCrop = crop;
      bestData = data;
    }
  }

  // Normalize score to percentage
  const confidence = Math.min(Math.round((bestScore / 100) * 100), 95);

  // Generate reason based on language
  const soilName = soilNames[language][input.soilType as keyof typeof soilNames.en] || input.soilType;
  const seasonName = seasonNames[language][input.season as keyof typeof seasonNames.en] || input.season;

  const reason = reasonTemplates[language](
    bestCrop,
    soilName,
    input.ph,
    seasonName,
    input.temperature,
    input.rainfall,
    input.nitrogen,
    input.phosphorus,
    input.potassium
  );

  return {
    crop: bestCrop,
    confidence,
    reason,
    irrigation: bestData.irrigation[language],
    fertilizer: bestData.fertilizer[language],
  };
}

// Disease detection knowledge base (simulates CNN classification)
const diseaseDatabase: Record<string, {
  symptoms: string[];
  treatment: { en: string; ta: string };
  prevention: { en: string; ta: string };
}> = {
  'Bacterial Leaf Blight': {
    symptoms: ['water-soaked lesions', 'yellow margins', 'wilting'],
    treatment: {
      en: 'Apply copper-based bactericides (Copper oxychloride 50% WP @ 2.5g/L). Remove and destroy infected plant parts. Use streptomycin sulfate + tetracycline (300 ppm) spray.',
      ta: 'செப்பு அடிப்படையிலான பாக்டீரியா கொல்லிகளை (காப்பர் ஆக்ஸிகுளோரைடு 50% WP @ 2.5g/L) தெளிக்கவும். பாதிக்கப்பட்ட தாவர பாகங்களை அகற்றி அழிக்கவும். ஸ்ட்ரெப்டோமைசின் சல்பேட் + டெட்ராசைக்ளின் (300 ppm) தெளிப்பு பயன்படுத்தவும்.',
    },
    prevention: {
      en: 'Use certified disease-free seeds. Avoid excess nitrogen fertilization. Maintain proper field drainage. Practice crop rotation with non-host crops.',
      ta: 'சான்றிதழ் பெற்ற நோயற்ற விதைகளைப் பயன்படுத்தவும். அதிக நைட்ரஜன் உரமிடுதலைத் தவிர்க்கவும். சரியான வயல் வடிகால் பராமரிக்கவும். ஹோஸ்ட் அல்லாத பயிர்களுடன் பயிர் சுழற்சி நடைமுறைப்படுத்தவும்.',
    },
  },
  'Brown Spot': {
    symptoms: ['brown spots', 'oval lesions', 'yellow halo'],
    treatment: {
      en: 'Spray Mancozeb 75% WP @ 2g/L or Carbendazim 50% WP @ 1g/L at 15-day intervals. Apply potassium fertilizers to strengthen plant immunity.',
      ta: 'மான்கோசெப் 75% WP @ 2g/L அல்லது கார்பென்டாசிம் 50% WP @ 1g/L 15 நாள் இடைவெளியில் தெளிக்கவும். தாவர நோய் எதிர்ப்பு சக்தியை வலுப்படுத்த பொட்டாசியம் உரங்களைப் பயன்படுத்தவும்.',
    },
    prevention: {
      en: 'Treat seeds with fungicides before sowing. Avoid water stress during crop growth. Maintain balanced fertilization. Remove crop residues after harvest.',
      ta: 'விதைப்பதற்கு முன் பூஞ்சைக் கொல்லிகளால் விதைகளை சுத்தம் செய்யவும். பயிர் வளர்ச்சியின் போது நீர் பற்றாக்குறையைத் தவிர்க்கவும். சமச்சீர் உரமிடுதலை பராமரிக்கவும். அறுவடைக்குப் பிறகு பயிர் எச்சங்களை அகற்றவும்.',
    },
  },
  'Leaf Blast': {
    symptoms: ['diamond-shaped lesions', 'gray center', 'brown border'],
    treatment: {
      en: 'Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L. Apply 2-3 sprays at 10-day intervals during disease progression.',
      ta: 'ட்ரைசைக்ளாசோல் 75% WP @ 0.6g/L அல்லது ஐசோப்ரோத்தியோலேன் 40% EC @ 1.5ml/L தெளிக்கவும். நோய் பரவும் போது 10 நாள் இடைவெளியில் 2-3 தெளிப்புகள் செய்யவும்.',
    },
    prevention: {
      en: 'Use resistant varieties. Avoid excessive nitrogen application. Split nitrogen doses. Maintain proper water management. Remove weed hosts.',
      ta: 'எதிர்ப்புத் திறன் கொண்ட ரகங்களைப் பயன்படுத்தவும். அதிக நைட்ரஜன் பயன்பாட்டைத் தவிர்க்கவும். நைட்ரஜனை பிரித்து இடவும். சரியான நீர் மேலாண்மையை பராமரிக்கவும். களை ஹோஸ்ட்களை அகற்றவும்.',
    },
  },
  'Septoria Leaf Spot': {
    symptoms: ['circular spots', 'dark margins', 'pycnidia'],
    treatment: {
      en: 'Apply Chlorothalonil 75% WP @ 2g/L or Propiconazole 25% EC @ 1ml/L. Start spraying at first symptom appearance.',
      ta: 'குளோரோதலோனில் 75% WP @ 2g/L அல்லது ப்ரோபிகோனசோல் 25% EC @ 1ml/L தெளிக்கவும். முதல் அறிகுறி தோன்றும்போதே தெளிப்பைத் தொடங்கவும்.',
    },
    prevention: {
      en: 'Rotate crops for 2-3 years. Use disease-free planting material. Remove infected plant debris. Avoid overhead irrigation.',
      ta: '2-3 ஆண்டுகளுக்கு பயிர் சுழற்சி செய்யவும். நோயற்ற நடவு பொருட்களைப் பயன்படுத்தவும். பாதிக்கப்பட்ட தாவர குப்பைகளை அகற்றவும். மேல்நிலை நீர்ப்பாசனத்தைத் தவிர்க்கவும்.',
    },
  },
  'Powdery Mildew': {
    symptoms: ['white powder', 'curled leaves', 'stunted growth'],
    treatment: {
      en: 'Spray Sulfur 80% WP @ 2g/L or Hexaconazole 5% SC @ 2ml/L. Apply Karathane (Dinocap) @ 1ml/L for severe infections.',
      ta: 'சல்ஃபர் 80% WP @ 2g/L அல்லது ஹெக்ஸாகோனசோல் 5% SC @ 2ml/L தெளிக்கவும். கடுமையான தொற்றுக்கு கரத்தேன் (டைனோகாப்) @ 1ml/L பயன்படுத்தவும்.',
    },
    prevention: {
      en: 'Ensure good air circulation. Avoid excess nitrogen. Use resistant varieties. Remove and destroy infected leaves promptly.',
      ta: 'நல்ல காற்று சுழற்சியை உறுதி செய்யவும். அதிக நைட்ரஜனைத் தவிர்க்கவும். எதிர்ப்புத் திறன் கொண்ட ரகங்களைப் பயன்படுத்தவும். பாதிக்கப்பட்ட இலைகளை உடனடியாக அகற்றி அழிக்கவும்.',
    },
  },
  'Downy Mildew': {
    symptoms: ['yellow patches', 'downy growth', 'leaf curling'],
    treatment: {
      en: 'Apply Metalaxyl + Mancozeb @ 2.5g/L or Fosetyl-Al 80% WP @ 2g/L. Spray on underside of leaves in early morning.',
      ta: 'மெட்டாலாக்ஸில் + மான்கோசெப் @ 2.5g/L அல்லது ஃபோசெட்டில்-Al 80% WP @ 2g/L தெளிக்கவும். காலை நேரத்தில் இலைகளின் கீழ்ப்புறத்தில் தெளிக்கவும்.',
    },
    prevention: {
      en: 'Use resistant cultivars. Improve field drainage. Avoid late evening irrigation. Maintain proper plant spacing.',
      ta: 'எதிர்ப்புத் திறன் கொண்ட ரகங்களைப் பயன்படுத்தவும். வயல் வடிகாலை மேம்படுத்தவும். மாலை நேர நீர்ப்பாசனத்தைத் தவிர்க்கவும். சரியான தாவர இடைவெளியை பராமரிக்கவும்.',
    },
  },
  'Early Blight': {
    symptoms: ['target-like spots', 'concentric rings', 'yellowing'],
    treatment: {
      en: 'Spray Mancozeb 75% WP @ 2.5g/L or Chlorothalonil @ 2g/L. Apply Azoxystrobin 23% SC @ 1ml/L for better control.',
      ta: 'மான்கோசெப் 75% WP @ 2.5g/L அல்லது குளோரோதலோனில் @ 2g/L தெளிக்கவும். சிறந்த கட்டுப்பாட்டிற்கு அசோக்ஸிஸ்ட்ரோபின் 23% SC @ 1ml/L பயன்படுத்தவும்.',
    },
    prevention: {
      en: 'Stake plants for better air circulation. Mulch to prevent soil splash. Remove lower infected leaves. Rotate with non-solanaceous crops.',
      ta: 'சிறந்த காற்று சுழற்சிக்கு தாவரங்களை ஆதரவு கொடுக்கவும். மண் தெறிப்பைத் தடுக்க மல்ச் செய்யவும். கீழே பாதிக்கப்பட்ட இலைகளை அகற்றவும். சோலனேசியஸ் அல்லாத பயிர்களுடன் சுழற்சி செய்யவும்.',
    },
  },
  'Late Blight': {
    symptoms: ['water-soaked lesions', 'white mold', 'rapid spread'],
    treatment: {
      en: 'Apply Cymoxanil + Mancozeb @ 3g/L immediately. Use Dimethomorph 50% WP @ 1g/L. Spray every 5-7 days during wet weather.',
      ta: 'உடனடியாக சைமோக்சானில் + மான்கோசெப் @ 3g/L தெளிக்கவும். டைமெத்தோமார்ஃப் 50% WP @ 1g/L பயன்படுத்தவும். ஈரமான வானிலையில் ஒவ்வொரு 5-7 நாட்களுக்கும் தெளிக்கவும்.',
    },
    prevention: {
      en: 'Plant certified disease-free seed. Destroy volunteer plants. Avoid overhead irrigation. Harvest promptly when mature.',
      ta: 'சான்றிதழ் பெற்ற நோயற்ற விதைகளை நடவும். தானாக வளரும் தாவரங்களை அழிக்கவும். மேல்நிலை நீர்ப்பாசனத்தைத் தவிர்க்கவும். முதிர்ச்சியடையும்போது உடனடியாக அறுவடை செய்யவும்.',
    },
  },
  'Anthracnose': {
    symptoms: ['sunken lesions', 'pink spores', 'fruit rot'],
    treatment: {
      en: 'Spray Carbendazim 50% WP @ 1g/L or Thiophanate methyl @ 1g/L. Apply at flowering and fruit development stages.',
      ta: 'கார்பென்டாசிம் 50% WP @ 1g/L அல்லது தியோபனேட் மெத்தில் @ 1g/L தெளிக்கவும். பூக்கும் மற்றும் பழ வளர்ச்சி நிலைகளில் பயன்படுத்தவும்.',
    },
    prevention: {
      en: 'Use disease-free seeds. Avoid working in wet fields. Remove infected fruits. Maintain field hygiene.',
      ta: 'நோயற்ற விதைகளைப் பயன்படுத்தவும். ஈரமான வயல்களில் வேலை செய்வதைத் தவிர்க்கவும். பாதிக்கப்பட்ட பழங்களை அகற்றவும். வயல் சுகாதாரத்தை பராமரிக்கவும்.',
    },
  },
  'Mosaic Virus': {
    symptoms: ['mottled leaves', 'yellow-green pattern', 'distortion'],
    treatment: {
      en: 'No direct cure for viral diseases. Control aphid vectors with Imidacloprid 17.8% SL @ 0.3ml/L. Remove and destroy infected plants.',
      ta: 'வைரஸ் நோய்களுக்கு நேரடி சிகிச்சை இல்லை. இமிடாக்ளோப்ரிட் 17.8% SL @ 0.3ml/L மூலம் அஃபிட் வெக்டர்களைக் கட்டுப்படுத்தவும். பாதிக்கப்பட்ட தாவரங்களை அகற்றி அழிக்கவும்.',
    },
    prevention: {
      en: 'Use virus-free planting material. Control aphid populations. Remove weed hosts. Use reflective mulches to deter aphids.',
      ta: 'வைரஸ் இல்லாத நடவு பொருட்களைப் பயன்படுத்தவும். அஃபிட் எண்ணிக்கையைக் கட்டுப்படுத்தவும். களை ஹோஸ்ட்களை அகற்றவும். அஃபிட்களை தடுக்க பிரதிபலிப்பு மல்ச் பயன்படுத்தவும்.',
    },
  },
};

const healthyResponses = {
  en: [
    'The leaf appears healthy with no visible signs of disease. The green coloration and leaf structure indicate good plant health.',
    'This crop leaf shows healthy characteristics. Continue with current management practices for optimal growth.',
    'No disease symptoms detected. The leaf displays normal growth patterns and coloration.',
  ],
  ta: [
    'இலை நோயின் அறிகுறிகள் இல்லாமல் ஆரோக்கியமாக தெரிகிறது. பச்சை நிறம் மற்றும் இலை அமைப்பு நல்ல தாவர ஆரோக்கியத்தைக் குறிக்கிறது.',
    'இந்த பயிர் இலை ஆரோக்கியமான குணாதிசயங்களைக் காட்டுகிறது. உகந்த வளர்ச்சிக்கு தற்போதைய மேலாண்மை நடைமுறைகளைத் தொடரவும்.',
    'நோய் அறிகுறிகள் கண்டறியப்படவில்லை. இலை சாதாரண வளர்ச்சி வடிவங்களையும் நிறத்தையும் காட்டுகிறது.',
  ],
};

const healthyPreventionText = {
  en: 'Continue regular monitoring. Maintain proper irrigation and fertilization. Scout fields weekly for early detection of any issues.',
  ta: 'வழக்கமான கண்காணிப்பைத் தொடரவும். சரியான நீர்ப்பாசனம் மற்றும் உரமிடுதலை பராமரிக்கவும். ஏதேனும் பிரச்சனைகளை முன்கூட்டியே கண்டறிய வாரந்தோறும் வயல்களை ஆய்வு செய்யவும்.',
};

export function simulateDiseaseDetection(imageFile: File, language: 'en' | 'ta' = 'en'): Promise<DiseaseDetectionResult> {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Randomly select a disease or healthy result for demo
      // In production, this would be actual CNN inference
      const random = Math.random();
      
      if (random > 0.7) {
        // 30% chance of healthy result
        const responses = healthyResponses[language];
        resolve({
          disease: 'Healthy',
          confidence: Math.round(85 + Math.random() * 12),
          isHealthy: true,
          treatment: responses[Math.floor(Math.random() * responses.length)],
          prevention: healthyPreventionText[language],
        });
      } else {
        // 70% chance of disease detection
        const diseases = Object.keys(diseaseDatabase);
        const selectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
        const diseaseData = diseaseDatabase[selectedDisease];

        resolve({
          disease: selectedDisease,
          confidence: Math.round(75 + Math.random() * 20),
          isHealthy: false,
          treatment: diseaseData.treatment[language],
          prevention: diseaseData.prevention[language],
        });
      }
    }, 2500); // Simulate AI processing time
  });
}
