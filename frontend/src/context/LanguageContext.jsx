import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    welcome: 'Welcome to QuizMaster',
    launch: 'Launch Portal',
    login: 'Login',
    register: 'Create Account',
    adminDashboard: 'Admin Dashboard',
    studentDashboard: 'Student Dashboard',
    startExam: 'Start Exam',
    submit: 'Submit Answers'
  },
  te: {
    welcome: 'క్విజ్‌మాస్టర్‌కు స్వాగతం',
    launch: 'పోర్టల్ ప్రారంభించండి',
    login: 'లాగిన్',
    register: 'ఖాతాను సృష్టించండి',
    adminDashboard: 'అడ్మిన్ డాష్బోర్డ్',
    studentDashboard: 'విద్యార్థి డాష్బోర్డ్',
    startExam: 'పరీక్ష ప్రారంభించండి',
    submit: 'సమాధానాలు సమర్పించండి'
  },
  hi: {
    welcome: 'क्विज़मास्टर में आपका स्वागत है',
    launch: 'पोर्टल लॉन्च करें',
    login: 'लॉग इन करें',
    register: 'खाता बनाएं',
    adminDashboard: 'एडमिन डैशबोर्ड',
    studentDashboard: 'छात्र डैशबोर्ड',
    startExam: 'परीक्षा शुरू करें',
    submit: 'उत्तर सबमिट करें'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
