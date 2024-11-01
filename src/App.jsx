import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Partners from './components/Partners';
import Footer from './components/Footer';

function App() {
  const [language, setLanguage] = useState('en');

  return (
    <div className={`min-h-screen ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Navbar language={language} setLanguage={setLanguage} />
      <Hero language={language} />
      <Partners language={language} />
      <Footer language={language} />
    </div>
  );
}

export default App;