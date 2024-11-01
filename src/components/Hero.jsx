function Hero({ language }) {
  const content = {
    en: {
      title: 'Join Our Trusted Network of Partners',
      subtitle: 'Unlock Your Property Journey Today!'
    },
    ar: {
      title: 'انضم إلى شبكتنا الموثوقة من الشركاء',
      subtitle: 'ابدأ رحلتك العقارية اليوم!'
    }
  }

  const t = content[language]

  return (
    <div 
      className="relative py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(153, 109, 109, 0.2) 50%, #FFFFFF 100%)'
      }}
    >
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl font-black mb-6 ${
            language === 'ar' ? 'font-arabic-black' : 'font-black'
          } text-black`}>
            {t.title}
          </h1>
          <p className={`text-xl md:text-2xl font-black ${
            language === 'ar' ? 'font-arabic-black' : 'font-black'
          } text-black/90`}>
            {t.subtitle}
          </p>
        </div>
      </div>
      
      {/* Decorative wave */}
      {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          className="relative block w-full h-12 text-white" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-current"
          ></path>
        </svg>
      </div> */}
    </div>
  )
}

export default Hero;