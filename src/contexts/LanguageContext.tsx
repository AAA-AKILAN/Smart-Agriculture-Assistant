import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.decision_support': 'Decision Support',
    'nav.disease_detection': 'Disease Detection',
    'nav.history': 'History',

    // Home page
    'home.title': 'AgriSmart AI',
    'home.subtitle': 'AI-Based Agriculture Decision Support System',
    'home.tagline': 'Smart AI Assistance for Modern Farming',
    'home.description': 'Empowering farmers with intelligent crop recommendations and disease detection powered by advanced AI technology.',
    'home.get_started': 'Get Started',
    'home.learn_more': 'Learn More',

    // Features
    'feature.decision.title': 'Smart Crop Recommendations',
    'feature.decision.desc': 'Get AI-powered suggestions for the best crops based on your soil, season, and climate conditions.',
    'feature.disease.title': 'Disease Detection',
    'feature.disease.desc': 'Upload leaf images to instantly identify plant diseases and receive treatment recommendations.',
    'feature.history.title': 'Track Your History',
    'feature.history.desc': 'Access all your past recommendations and disease detections in one place.',

    // Decision Support
    'decision.title': 'Agriculture Decision Support',
    'decision.subtitle': 'Get AI-powered crop recommendations based on your farming conditions',
    'decision.soil_type': 'Soil Type',
    'decision.soil_type.placeholder': 'Select soil type',
    'decision.soil_type.alluvial': 'Alluvial Soil',
    'decision.soil_type.black': 'Black Soil',
    'decision.soil_type.red': 'Red Soil',
    'decision.soil_type.laterite': 'Laterite Soil',
    'decision.soil_type.sandy': 'Sandy Soil',
    'decision.soil_type.clay': 'Clay Soil',
    'decision.season': 'Season',
    'decision.season.placeholder': 'Select season',
    'decision.season.kharif': 'Kharif (June-October)',
    'decision.season.rabi': 'Rabi (October-March)',
    'decision.season.zaid': 'Zaid (March-June)',
    'decision.temperature': 'Temperature (°C)',
    'decision.rainfall': 'Annual Rainfall (mm)',
    'decision.weather': 'Current Weather',
    'decision.weather.placeholder': 'Select weather condition',
    'decision.weather.sunny': 'Sunny',
    'decision.weather.cloudy': 'Cloudy',
    'decision.weather.rainy': 'Rainy',
    'decision.weather.humid': 'Humid',
    'decision.weather.dry': 'Dry',
    'decision.ph': 'Soil pH',
    'decision.nitrogen': 'Nitrogen (kg/ha)',
    'decision.phosphorus': 'Phosphorus (kg/ha)',
    'decision.potassium': 'Potassium (kg/ha)',
    'decision.get_recommendation': 'Get Recommendation',
    'decision.analyzing': 'Analyzing...',
    'decision.result.title': 'AI Recommendation',
    'decision.result.crop': 'Recommended Crop',
    'decision.result.confidence': 'Confidence',
    'decision.result.reason': 'Reason',
    'decision.result.irrigation': 'Irrigation Guidance',
    'decision.result.fertilizer': 'Fertilizer Suggestion',

    // Disease Detection
    'disease.title': 'Crop Disease Detection',
    'disease.subtitle': 'Upload a leaf image to detect plant diseases using AI',
    'disease.upload': 'Upload Leaf Image',
    'disease.upload.desc': 'Drag and drop or click to upload',
    'disease.upload.formats': 'Supports JPG, PNG (Max 10MB)',
    'disease.analyze': 'Analyze Image',
    'disease.analyzing': 'Analyzing...',
    'disease.result.title': 'Detection Result',
    'disease.result.disease': 'Detected Disease',
    'disease.result.confidence': 'Confidence',
    'disease.result.treatment': 'Treatment',
    'disease.result.prevention': 'Prevention',
    'disease.result.healthy': 'Healthy',
    'disease.result.healthy.desc': 'Your crop leaf appears to be healthy with no visible signs of disease.',

    // History
    'history.title': 'Your History',
    'history.subtitle': 'View all your past recommendations and disease detections',
    'history.tab.all': 'All',
    'history.tab.recommendations': 'Crop Recommendations',
    'history.tab.detections': 'Disease Detections',
    'history.empty': 'No history yet',
    'history.empty.desc': 'Start using the decision support or disease detection features to build your history.',
    'history.date': 'Date',
    'history.type': 'Type',
    'history.result': 'Result',
    'history.clear': 'Clear History',
    'history.clear.confirm': 'Are you sure you want to clear all history?',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.dark_mode': 'Dark Mode',
    'common.light_mode': 'Light Mode',
    'common.language': 'Language',

    // Weather
    'weather.fetching': 'Fetching weather...',
    'weather.fetch_location': 'Use My Location',
    'weather.location_error': 'Could not get location',
    'weather.updated': 'Weather data updated',

    // Footer
    'footer.tagline': 'Empowering farmers with AI technology',
    'footer.project': 'B.Tech IT Final Year Project',
    'footer.copyright': '© 2026 AgriSmart AI. All rights reserved.',
  },
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.decision_support': 'முடிவு ஆதரவு',
    'nav.disease_detection': 'நோய் கண்டறிதல்',
    'nav.history': 'வரலாறு',

    // Home page
    'home.title': 'அக்ரிஸ்மார்ட் AI',
    'home.subtitle': 'AI அடிப்படையிலான விவசாய முடிவு ஆதரவு அமைப்பு',
    'home.tagline': 'நவீன விவசாயத்திற்கான ஸ்மார்ட் AI உதவி',
    'home.description': 'மேம்பட்ட AI தொழில்நுட்பத்தால் இயக்கப்படும் அறிவார்ந்த பயிர் பரிந்துரைகள் மற்றும் நோய் கண்டறிதல் மூலம் தமிழ்நாடு விவசாயிகளுக்கு அதிகாரம் அளித்தல்.',
    'home.get_started': 'தொடங்குங்கள்',
    'home.learn_more': 'மேலும் அறிக',

    // Features
    'feature.decision.title': 'ஸ்மார்ட் பயிர் பரிந்துரைகள்',
    'feature.decision.desc': 'உங்கள் மண், பருவம் மற்றும் காலநிலை நிலைமைகளின் அடிப்படையில் சிறந்த பயிர்களுக்கான AI இயங்கும் பரிந்துரைகளைப் பெறுங்கள்.',
    'feature.disease.title': 'நோய் கண்டறிதல்',
    'feature.disease.desc': 'தாவர நோய்களை உடனடியாக கண்டறிந்து சிகிச்சை பரிந்துரைகளைப் பெற இலை படங்களை பதிவேற்றவும்.',
    'feature.history.title': 'உங்கள் வரலாற்றை கண்காணிக்கவும்',
    'feature.history.desc': 'உங்கள் அனைத்து கடந்த கால பரிந்துரைகள் மற்றும் நோய் கண்டறிதல்களை ஒரே இடத்தில் அணுகவும்.',

    // Decision Support
    'decision.title': 'விவசாய முடிவு ஆதரவு',
    'decision.subtitle': 'உங்கள் விவசாய நிலைமைகளின் அடிப்படையில் AI இயங்கும் பயிர் பரிந்துரைகளைப் பெறுங்கள்',
    'decision.soil_type': 'மண் வகை',
    'decision.soil_type.placeholder': 'மண் வகையை தேர்வு செய்யவும்',
    'decision.soil_type.alluvial': 'வண்டல் மண்',
    'decision.soil_type.black': 'கருப்பு மண்',
    'decision.soil_type.red': 'சிவப்பு மண்',
    'decision.soil_type.laterite': 'லேட்டரைட் மண்',
    'decision.soil_type.sandy': 'மணல் மண்',
    'decision.soil_type.clay': 'களிமண்',
    'decision.season': 'பருவம்',
    'decision.season.placeholder': 'பருவத்தை தேர்வு செய்யவும்',
    'decision.season.kharif': 'காரிஃப் (ஜூன்-அக்டோபர்)',
    'decision.season.rabi': 'ரபி (அக்டோபர்-மார்ச்)',
    'decision.season.zaid': 'ஜைத் (மார்ச்-ஜூன்)',
    'decision.temperature': 'வெப்பநிலை (°C)',
    'decision.rainfall': 'ஆண்டு மழைப்பொழிவு (மிமீ)',
    'decision.weather': 'தற்போதைய வானிலை',
    'decision.weather.placeholder': 'வானிலை நிலையை தேர்வு செய்யவும்',
    'decision.weather.sunny': 'வெயில்',
    'decision.weather.cloudy': 'மேகமூட்டம்',
    'decision.weather.rainy': 'மழை',
    'decision.weather.humid': 'ஈரப்பதமான',
    'decision.weather.dry': 'வறண்ட',
    'decision.ph': 'மண் pH',
    'decision.nitrogen': 'நைட்ரஜன் (கிலோ/ஹெக்டேர்)',
    'decision.phosphorus': 'பாஸ்பரஸ் (கிலோ/ஹெக்டேர்)',
    'decision.potassium': 'பொட்டாசியம் (கிலோ/ஹெக்டேர்)',
    'decision.get_recommendation': 'பரிந்துரை பெறுங்கள்',
    'decision.analyzing': 'பகுப்பாய்வு செய்கிறது...',
    'decision.result.title': 'AI பரிந்துரை',
    'decision.result.crop': 'பரிந்துரைக்கப்பட்ட பயிர்',
    'decision.result.confidence': 'நம்பகத்தன்மை',
    'decision.result.reason': 'காரணம்',
    'decision.result.irrigation': 'நீர்ப்பாசன வழிகாட்டுதல்',
    'decision.result.fertilizer': 'உர பரிந்துரை',

    // Disease Detection
    'disease.title': 'பயிர் நோய் கண்டறிதல்',
    'disease.subtitle': 'AI பயன்படுத்தி தாவர நோய்களை கண்டறிய இலை படத்தை பதிவேற்றவும்',
    'disease.upload': 'இலை படத்தை பதிவேற்றவும்',
    'disease.upload.desc': 'இழுத்து விடவும் அல்லது கிளிக் செய்து பதிவேற்றவும்',
    'disease.upload.formats': 'JPG, PNG ஆதரிக்கப்படுகிறது (அதிகபட்சம் 10MB)',
    'disease.analyze': 'படத்தை பகுப்பாய்வு செய்',
    'disease.analyzing': 'பகுப்பாய்வு செய்கிறது...',
    'disease.result.title': 'கண்டறிதல் முடிவு',
    'disease.result.disease': 'கண்டறியப்பட்ட நோய்',
    'disease.result.confidence': 'நம்பகத்தன்மை',
    'disease.result.treatment': 'சிகிச்சை',
    'disease.result.prevention': 'தடுப்பு',
    'disease.result.healthy': 'ஆரோக்கியமானது',
    'disease.result.healthy.desc': 'உங்கள் பயிர் இலை நோயின் அறிகுறிகள் இல்லாமல் ஆரோக்கியமாக தெரிகிறது.',

    // History
    'history.title': 'உங்கள் வரலாறு',
    'history.subtitle': 'உங்கள் அனைத்து கடந்த கால பரிந்துரைகள் மற்றும் நோய் கண்டறிதல்களை காணவும்',
    'history.tab.all': 'அனைத்தும்',
    'history.tab.recommendations': 'பயிர் பரிந்துரைகள்',
    'history.tab.detections': 'நோய் கண்டறிதல்கள்',
    'history.empty': 'இதுவரை வரலாறு இல்லை',
    'history.empty.desc': 'உங்கள் வரலாற்றை உருவாக்க முடிவு ஆதரவு அல்லது நோய் கண்டறிதல் அம்சங்களைப் பயன்படுத்தத் தொடங்குங்கள்.',
    'history.date': 'தேதி',
    'history.type': 'வகை',
    'history.result': 'முடிவு',
    'history.clear': 'வரலாற்றை அழி',
    'history.clear.confirm': 'அனைத்து வரலாற்றையும் அழிக்க விரும்புகிறீர்களா?',

    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை ஏற்பட்டது',
    'common.retry': 'மீண்டும் முயற்சிக்கவும்',
    'common.back': 'பின்செல்',
    'common.cancel': 'ரத்து செய்',
    'common.confirm': 'உறுதிப்படுத்து',
    'common.save': 'சேமி',
    'common.delete': 'நீக்கு',
    'common.view': 'காண்க',
    'common.dark_mode': 'இருள் பயன்முறை',
    'common.light_mode': 'ஒளி பயன்முறை',
    'common.language': 'மொழி',

    // Weather
    'weather.fetching': 'வானிலை பெறுகிறது...',
    'weather.fetch_location': 'என் இருப்பிடத்தை பயன்படுத்து',
    'weather.location_error': 'இருப்பிடத்தை பெற முடியவில்லை',
    'weather.updated': 'வானிலை தரவு புதுப்பிக்கப்பட்டது',

    // Footer
    'footer.tagline': 'AI தொழில்நுட்பத்துடன் விவசாயிகளுக்கு அதிகாரம் அளித்தல்',
    'footer.project': 'B.Tech IT இறுதியாண்டு திட்டம்',
    'footer.copyright': '© 2026 அக்ரிஸ்மார்ட் AI. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agrismart-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agrismart-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'ta') {
      document.documentElement.classList.add('font-tamil');
    } else {
      document.documentElement.classList.remove('font-tamil');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
