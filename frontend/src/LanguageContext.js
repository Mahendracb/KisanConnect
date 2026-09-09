import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    // Sidebar
    "Dashboard": "Dashboard",
    "Crop Prices": "Crop Prices",
    "Weather Advisory": "Weather & Spray",
    "Weather & Spray": "Weather & Spray",
    "e-Mandi": "Live e-Mandi",
    "Live e-Mandi": "Live e-Mandi",
    "Schemes": "Schemes",
    "Fertilizer": "Fertilizer",
    "Buyers": "Buyers",
    "AI Recommend": "AI Recommend",
    "Farmer Profile": "Farmer Profile",
    "Language": "Language",
    
    // AI Recommend Page
    "AI Crop Guide": "AI Crop Guide",
    "ai_subtitle": "Tell us about your land and water availability. Our AI will recommend the most profitable crops to grow this season.",
    "Land Profile": "Land Profile",
    "Soil Type": "Soil Type",
    "Current Season": "Current Season",
    "Water Availability": "Water Availability",
    "Get Recommendations": "Get Recommendations",
    "Analyzing...": "Analyzing...",
    "Awaiting Input": "Awaiting Input",
    "awaiting_sub": "Submit your land profile to see which crops will give you the best yield and profit.",
    "Generating AI Insights...": "Generating AI Insights...",
    "generating_sub": "Analyzing optimal crops for your soil and climate data.",
    "AI Recommendations": "AI Recommendations",
    "Match": "Match",
    "AI REASONING": "AI REASONING",

    // Crop Prices (Home Page)
    "Market Prices": "Market Prices",
    "market_sub": "Get real-time agricultural commodity prices across Karnataka.",
    "Search crops...": "Search crops...",
    "Filter by location...": "Filter by location...",
    "State-wide Averages": "State-wide Averages",
    "Market Insights": "Market Insights",
    "Highest Price Today": "Highest Price Today",
    "14 - Day Trend": "14 - Day Trend",

    // Dashboard
    "Welcome to farmX": "Welcome to farmX",
    "dash_sub": "Your smart companion for better farming decisions, accurate pricing, and government support.",
    "Fertilizer Calc": "Fertilizer Calc",
    "Total Crops": "Total Crops",
    "Active Buyers": "Active Buyers",
    "Govt Schemes": "Govt Schemes",
    "Top Market Prices": "Top Market Prices",
    "Featured Schemes": "Featured Schemes",
    "View All": "View All",

    // Auth
    "Login": "Login",
    "Logout": "Logout",
    "Farmer Login": "Farmer Login",
    "Access your farmX account": "Access your farmX account",
    "Username": "Username",
    "Password": "Password",
    "Sign In": "Sign In",
    "Invalid username or password": "Invalid username or password",
    "Enter username": "Enter username",
    "Enter password": "Enter password",
    "Email": "Email",
    "Member Since": "Member Since",
    "Farm Details": "Farm Details",
    "Location": "Location",
    "Primary Crop": "Primary Crop",
    "Contact": "Contact",
    "Light Mode": "Light Mode",
    "Dark Mode": "Dark Mode",
    "Create farmX Account": "Create farmX Account",
    "Join the modern farming community": "Join the modern farming community",
    "Phone": "Phone",
    "First Name": "First Name",
    "Last Name": "Last Name",
    "Phone Number": "Phone Number",
    "Email Address": "Email Address",
    "Create password": "Create password",
    "Register": "Register",
    "Registration failed. Please try again.": "Registration failed. Please try again.",
    "Already have an account?": "Already have an account?",
    "Login here": "Login here",
    "New to farmX?": "New to farmX?",
    "Create an Account": "Create an Account",
    "Username, Email or Phone": "Username, Email or Phone"
  },
  kn: {
    // Sidebar
    "Dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "Crop Prices": "ಬೆಳೆ ಬೆಲೆಗಳು",
    "Weather Advisory": "ಹವಾಮಾನ & ಸಿಂಪಡಣೆ",
    "Weather & Spray": "ಹವಾಮಾನ & ಸಿಂಪಡಣೆ",
    "e-Mandi": "ಇ-ಮಂಡಿ ಮಾರುಕಟ್ಟೆ",
    "Live e-Mandi": "ಇ-ಮಂಡಿ ಮಾರುಕಟ್ಟೆ",
    "Schemes": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    "Fertilizer": "ರಸಗೊಬ್ಬರ",
    "Buyers": "ಖರೀದಿದಾರರು",
    "AI Recommend": "AI ಶಿಫಾರಸು",
    "Farmer Profile": "ರೈತರ ಪ್ರೊಫೈಲ್",
    "Language": "ಭಾಷೆ",
    
    // AI Recommend Page
    "AI Crop Guide": "AI ಬೆಳೆ ಮಾರ್ಗದರ್ಶಿ",
    "ai_subtitle": "ನಿಮ್ಮ ಭೂಮಿ ಮತ್ತು ನೀರಿನ ಲಭ್ಯತೆಯ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ. ನಮ್ಮ AI ಈ ಋತುವಿನಲ್ಲಿ ಬೆಳೆಯಲು ಉತ್ತಮ ಬೆಳೆಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ.",
    "Land Profile": "ಭೂಮಿಯ ವಿವರ",
    "Soil Type": "ಮಣ್ಣಿನ ಪ್ರಕಾರ",
    "Current Season": "ಪ್ರಸ್ತುತ ಋತು",
    "Water Availability": "ನೀರಿನ ಲಭ್ಯತೆ",
    "Get Recommendations": "ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ",
    "Analyzing...": "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    "Awaiting Input": "ಮಾಹಿತಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
    "awaiting_sub": "ಉತ್ತಮ ಇಳುವರಿ ಮತ್ತು ಲಾಭವನ್ನು ನೀಡುವ ಬೆಳೆಗಳನ್ನು ನೋಡಲು ನಿಮ್ಮ ಭೂಮಿಯ ವಿವರವನ್ನು ಸಲ್ಲಿಸಿ.",
    "Generating AI Insights...": "AI ಒಳನೋಟಗಳನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    "generating_sub": "ನಿಮ್ಮ ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ ಡೇಟಾಗಾಗಿ ಸೂಕ್ತವಾದ ಬೆಳೆಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ.",
    "AI Recommendations": "AI ಶಿಫಾರಸುಗಳು",
    "Match": "ಹೊಂದಾಣಿಕೆ",
    "AI REASONING": "AI ಕಾರಣ",

    // Crop Prices (Home Page)
    "Market Prices": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    "market_sub": "ಕರ್ನಾಟಕದಾದ್ಯಂತ ನೈಜ-ಸಮಯದ ಕೃಷಿ ಸರಕುಗಳ ಬೆಲೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
    "Search crops...": "ಬೆಳೆಗಳನ್ನು ಹುಡುಕಿ...",
    "Filter by location...": "ಸ್ಥಳದ ಮೂಲಕ ಫಿಲ್ಟರ್ ಮಾಡಿ...",
    "State-wide Averages": "ರಾಜ್ಯದಾದ್ಯಂತ ಸರಾಸರಿ",
    "Market Insights": "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು",
    "Highest Price Today": "ಇಂದಿನ ಅತಿ ಹೆಚ್ಚು ಬೆಲೆ",
    "14 - Day Trend": "14 ದಿನಗಳ ಟ್ರೆಂಡ್",

    // Dashboard
    "Welcome to farmX": "farmX ಗೆ ಸುಸ್ವಾಗತ",
    "dash_sub": "ಉತ್ತಮ ಕೃಷಿ ನಿರ್ಧಾರಗಳು, ನಿಖರವಾದ ಬೆಲೆ ನಿಗದಿ ಮತ್ತು ಸರ್ಕಾರದ ಬೆಂಬಲಕ್ಕಾಗಿ ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಒಡನಾಡಿ.",
    "Fertilizer Calc": "ರಸಗೊಬ್ಬರ ಲೆಕ್ಕಾಚಾರ",
    "Total Crops": "ಒಟ್ಟು ಬೆಳೆಗಳು",
    "Active Buyers": "ಸಕ್ರಿಯ ಖರೀದಿದಾರರು",
    "Govt Schemes": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    "Top Market Prices": "ಉನ್ನತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    "Featured Schemes": "ವೈಶಿಷ್ಟ್ಯಗೊಳಿಸಿದ ಯೋಜನೆಗಳು",
    "View All": "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",

    // Auth
    "Login": "ಲಾಗಿನ್",
    "Logout": "ಲಾಗ್ ಔಟ್",
    "Farmer Login": "ರೈತರ ಲಾಗಿನ್",
    "Access your farmX account": "ನಿಮ್ಮ farmX ಖಾತೆಯನ್ನು ಪ್ರವೇಶಿಸಿ",
    "Username": "ಬಳಕೆದಾರ ಹೆಸರು",
    "Password": "ಪಾಸ್ವರ್ಡ್",
    "Sign In": "ಸೈನ್ ಇನ್",
    "Invalid username or password": "ಅಮಾನ್ಯ ಬಳಕೆದಾರಹೆಸರು ಅಥವಾ ಪಾಸ್ವರ್ಡ್",
    "Enter username": "ಬಳಕೆದಾರಹೆಸರು ನಮೂದಿಸಿ",
    "Enter password": "ಪಾಸ್ವರ್ಡ್ ನಮೂದಿಸಿ",
    "Email": "ಇಮೇಲ್",
    "Member Since": "ಸದಸ್ಯರಾದ ದಿನಾಂಕ",
    "Farm Details": "ಕೃಷಿ ವಿವರಗಳು",
    "Location": "ಸ್ಥಳ",
    "Primary Crop": "ಮುಖ್ಯ ಬೆಳೆ",
    "Contact": "ಸಂಪರ್ಕಿಸಿ",
    "Light Mode": "ಲೈಟ್ ಮೋಡ್",
    "Dark Mode": "ಡಾರ್ಕ್ ಮೋಡ್",
    "Create farmX Account": "farmX ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    "Join the modern farming community": "ಆಧುನಿಕ ಕೃಷಿ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ",
    "Phone": "ಫೋನ್",
    "First Name": "ಮೊದಲ ಹೆಸರು",
    "Last Name": "ಕೊನೆಯ ಹೆಸರು",
    "Phone Number": "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
    "Email Address": "ಇಮೇಲ್ ವಿಳಾಸ",
    "Create password": "ಪಾಸ್ವರ್ಡ್ ರಚಿಸಿ",
    "Register": "ನೋಂದಾಯಿಸಿ",
    "Registration failed. Please try again.": "ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    "Already have an account?": "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
    "Login here": "ಇಲ್ಲಿ ಲಾಗಿನ್ ಮಾಡಿ",
    "New to farmX?": "farmX ಗೆ ಹೊಸಬರೇ?",
    "Create an Account": "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    "Username, Email or Phone": "ಬಳಕೆದಾರ ಹೆಸರು, ಇಮೇಲ್ ಅಥವಾ ಫೋನ್"
  },
  hi: {
    // Sidebar
    "Dashboard": "डैशबोर्ड",
    "Crop Prices": "फसल की कीमतें",
    "Schemes": "योजनाएं",
    "Fertilizer": "उर्वरक",
    "Buyers": "खरीदार",
    "AI Recommend": "एआई अनुशंसा",
    "Farmer Profile": "किसान प्रोफ़ाइल",
    "Language": "भाषा",
    
    // AI Recommend Page
    "AI Crop Guide": "एआई फसल गाइड",
    "ai_subtitle": "हमें अपनी जमीन और पानी की उपलब्धता के बारे में बताएं। हमारा एआई इस मौसम में उगाने के लिए सबसे लाभदायक फसलों की सिफारिश करेगा।",
    "Land Profile": "भूमि प्रोफ़ाइल",
    "Soil Type": "मिट्टी का प्रकार",
    "Current Season": "वर्तमान मौसम",
    "Water Availability": "पानी की उपलब्धता",
    "Get Recommendations": "सिफारिशें प्राप्त करें",
    "Analyzing...": "विश्लेषण कर रहा है...",
    "Awaiting Input": "इनपुट की प्रतीक्षा है",
    "awaiting_sub": "सर्वोत्तम उपज और लाभ देने वाली फसलों को देखने के लिए अपनी भूमि प्रोफ़ाइल सबमिट करें।",
    "Generating AI Insights...": "एआई अंतर्दृष्टि उत्पन्न कर रहा है...",
    "generating_sub": "आपकी मिट्टी और जलवायु डेटा के लिए इष्टतम फसलों का विश्लेषण।",
    "AI Recommendations": "एआई सिफारिशें",
    "Match": "मिलान",
    "AI REASONING": "एआई तर्क",

    // Crop Prices (Home Page)
    "Market Prices": "बाजार भाव",
    "market_sub": "पूरे कर्नाटक में वास्तविक समय में कृषि वस्तुओं की कीमतें प्राप्त करें।",
    "Search crops...": "फसलें खोजें...",
    "Filter by location...": "स्थान के अनुसार फ़िल्टर करें...",
    "State-wide Averages": "राज्यव्यापी औसत",
    "Market Insights": "बाजार अंतर्दृष्टि",
    "Highest Price Today": "आज की उच्चतम कीमत",
    "14 - Day Trend": "14 दिन का रुझान",

    // Dashboard
    "Welcome to farmX": "farmX में आपका स्वागत है",
    "dash_sub": "बेहतर कृषि निर्णयों, सटीक मूल्य निर्धारण और सरकारी सहायता के लिए आपका स्मार्ट साथी।",
    "Fertilizer Calc": "उर्वरक गणना",
    "Total Crops": "कुल फसलें",
    "Active Buyers": "सक्रिय खरीदार",
    "Govt Schemes": "सरकारी योजनाएं",
    "Top Market Prices": "शीर्ष बाजार मूल्य",
    "Featured Schemes": "विशेष रुप से प्रदर्शित योजनाएं",
    "View All": "सभी देखें",

    // Auth
    "Login": "लॉग इन",
    "Logout": "लॉग आउट",
    "Farmer Login": "किसान लॉग इन",
    "Access your farmX account": "अपने farmX खाते तक पहुंचें",
    "Username": "उपयोगकर्ता नाम",
    "Password": "पासवर्ड",
    "Sign In": "साइन इन करें",
    "Invalid username or password": "अमान्य उपयोगकर्ता नाम या पासवर्ड",
    "Enter username": "उपयोगकर्ता नाम दर्ज करें",
    "Enter password": "पासवर्ड दर्ज करें",
    "Email": "ईमेल",
    "Member Since": "सदस्यता तिथि",
    "Farm Details": "खेत का विवरण",
    "Location": "स्थान",
    "Primary Crop": "प्राथमिक फसल",
    "Contact": "संपर्क करें",
    "Light Mode": "लाइट मोड",
    "Dark Mode": "डार्क मोड",
    "Create farmX Account": "farmX खाता बनाएं",
    "Join the modern farming community": "आधुनिक कृषि समुदाय से जुड़ें",
    "Phone": "फ़ोन",
    "First Name": "प्रथम नाम",
    "Last Name": "अंतिम नाम",
    "Phone Number": "फ़ोन नंबर",
    "Email Address": "ईमेल पता",
    "Create password": "पासवर्ड बनाएं",
    "Register": "रजिस्टर करें",
    "Registration failed. Please try again.": "पंजीकरण विफल रहा। कृपया पुनः प्रयास करें।",
    "Already have an account?": "क्या आपके पास पहले से एक खाता है?",
    "Login here": "यहां लॉग इन करें",
    "New to farmX?": "farmX में नए हैं?",
    "Create an Account": "खाता बनाएं",
    "Username, Email or Phone": "उपयोगकर्ता नाम, ईमेल या फोन"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('farmx_lang') || "en";
  });

  React.useEffect(() => {
    localStorage.setItem('farmx_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
