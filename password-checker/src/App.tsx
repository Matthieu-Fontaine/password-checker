import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState('light');

  const [password, setPassword] = useState<string>("");
  const [passwordNumbers, setPasswordNumbers] = useState<boolean>(false);
  const [passwordSpecial, setPasswordSpecial] = useState<boolean>(false);
  const [passwordLower, setPasswordLower] = useState<boolean>(false);
  const [passwordUpper, setPasswordUpper] = useState<boolean>(false);
  const [crackTimeEstimation, setCrackTimeEstimation] = useState('');

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const toggleLang = () => {
    if (i18n.language === 'fr') {
      i18n.changeLanguage('en');
    } else {
      i18n.changeLanguage('fr');
    }
  }

  const calculateEntropy = (password: string): number => {
    const length = password.length;
    let charsetSize = 0;

    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32; // Approximation for special characters

    return length * Math.log2(charsetSize);
  };

  const crackTime = (password: string, attemptsPerSecond: number = 1e9): string => {
    const entropy = calculateEntropy(password);
    const combinations = Math.pow(2, entropy);
    const seconds = combinations / attemptsPerSecond;

    // Convert seconds to a human-readable format
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365;
    const centuries = years / 100;
    const millennia = centuries / 10;


    if(millennia > 1) return `${millennia.toFixed(2) + " " + t('millenaires')}`;
    if (centuries > 1) return `${centuries.toFixed(2) + " " +  t('siecles')}`;
    if (years > 1) return `${years.toFixed(2) + " " +  t('annees')}`;
    if (days > 1) return `${days.toFixed(2) + " " +  t('jours')}`;
    if (hours > 1) return `${hours.toFixed(2) + " " +  t('heures')}`;
    if (minutes > 1) return `${minutes.toFixed(2) + " " +  t('minutes')}`;

    if(seconds < 1) return t('instantane');

    return `${seconds.toFixed(2) + t('secondes')}`;
  };

  useEffect(() => {
    if (/[a-z]/.test(password)) {
      setPasswordLower(true);
    } else {
      setPasswordLower(false);
    }

    if (/[A-Z]/.test(password)) {
      setPasswordUpper(true);
    } else {
      setPasswordUpper(false);
    }

    if (/\d/.test(password)) {
      setPasswordNumbers(true);
    } else {
      setPasswordNumbers(false);
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
      setPasswordSpecial(true);
    } else {
      setPasswordSpecial(false);
    }

  }, [password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if(e.target.value === "") return setCrackTimeEstimation('^^');
    setCrackTimeEstimation(crackTime(password));
  }

  return (
    <>
      <div className="w-full h-screen bg-slate-200 flex flex-col snap-none">
        <header className="bg-gray-800 text-white text-center p-4 font-bold text-2xl">
          Password Checker
        </header>
        <div className="w-full flex flex-col lg:flex-row items-center justify-between ">
          <label htmlFor="theme" className=" ml-4 inline-flex items-center space-x-4 cursor-pointer dark:text-gray-100 mt-2">
            <span className="text-black">{t('clair')}</span>
            <span className="relative">
              <input id="theme" type="checkbox" className="hidden peer" onClick={toggleTheme} />
              <div className="w-10 h-6 rounded-full shadow-inner dark:bg-gray-400 peer-checked:dark:bg-violet-400"></div>
              <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-gray-800"></div>
            </span>
            <span className="text-black">{t('sombre')}</span>
          </label>

          <label htmlFor="langue" className="mr-4 inline-flex items-center space-x-4 cursor-pointer dark:text-gray-100 mt-2">
            <span className="text-black">{t('francais')}</span>
            <span className="relative">
              <input id="langue" type="checkbox" className="hidden peer" onClick={toggleLang} />
              <div className="w-10 h-6 rounded-full shadow-inner dark:bg-gray-400 peer-checked:dark:bg-violet-400"></div>
              <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-gray-800"></div>
            </span>
            <span className="text-black">{t('anglais')}</span>
          </label>
        </div>

        <div className="w-full h-full justify-center items-center flex flex-col">
          <input type="password" className="border border-gray-300 rounded-lg p-2 m-2 w-5/6 lg:w-1/3" placeholder={t('tapermotdepasse')} value={password} onChange={handleChange} />
          <div className="flex flex-col lg:flex-row gap-3">
            <span className="text-gray-800 font-bold">{password.length} {t('contient')} : </span>
            <span className={`text-gray-500 text-base lg:text-sm font-bold ${passwordLower ? 'text-red-400' : ''}`}>{t('minuscule')}</span>
            <span className={`text-gray-500 text-base lg:text-sm font-bold ${passwordUpper ? 'text-red-400' : ''}`}>{t('majuscule')}</span>
            <span className={`text-gray-500 text-base lg:text-sm font-bold ${passwordNumbers ? 'text-red-400' : ''}`}>{t('nombre')}</span>
            <span className={`text-gray-500 text-base lg:text-sm font-bold ${passwordSpecial ? 'text-red-400' : ''}`}>{t('characterespeciaux')}</span>
          </div>

          <h3 className="text-gray-800 font-bold text-lg mt-4">{t('tempestimercrack')} : {crackTimeEstimation}</h3>

        </div>
      </div>
    </>

  )
}