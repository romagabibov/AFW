import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import { useEffect, useRef } from "react";

import { useTranslation } from "../contexts/TranslationContext";

export function Hero() {
  const { t } = useTranslation();
  const { 
    heroVideoUrl,
    heroMobileVideoUrl,
    heroSubtitle = "Season 2026 • The Water Element",
    heroTitle1 = "AZERBAIJAN",
    heroTitle2 = "FASHION",
    heroTitle3 = "WEEK",
  } = useSettings();

  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, [heroVideoUrl]);

  useEffect(() => {
    if (mobileVideoRef.current) mobileVideoRef.current.load();
  }, [heroMobileVideoUrl]);

  const isHeroImage = heroVideoUrl?.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || (!heroVideoUrl?.match(/\.(mp4|webm|ogg|mov)/i) && heroVideoUrl?.includes("res.cloudinary.com"));
  const isMobileHeroImage = heroMobileVideoUrl?.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || (!heroMobileVideoUrl?.match(/\.(mp4|webm|ogg|mov)/i) && heroMobileVideoUrl?.includes("res.cloudinary.com"));

  return (
    <div id="home" className="relative h-screen w-full flex items-center justify-center bg-[#f7f7f7]">
      {/* Background Video/Image (Desktop) */}
      <div className="absolute inset-0 z-0 bg-[#f7f7f7] hidden md:block">
        {heroVideoUrl ? (
          isHeroImage ? (
            <img src={heroVideoUrl} alt="Hero Background" className="w-full h-full object-cover" />
          ) : (
            <video 
              ref={videoRef}
              autoPlay 
              loop 
              muted 
              playsInline
              controls={false}
              className="w-full h-full object-cover"
            >
              <source src={heroVideoUrl?.toLowerCase().endsWith(".mov") && heroVideoUrl.includes("res.cloudinary.com") ? heroVideoUrl.replace(/\.mov$/i, ".mp4") : heroVideoUrl} />
            </video>
          )
        ) : null}
        <div className="absolute inset-0 bg-black/30"></div>
        {/* Subtle white transition overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#f7f7f7]"></div>
      </div>

      {/* Background Video/Image (Mobile) */}
      <div className="absolute inset-0 z-0 bg-[#f7f7f7] block md:hidden">
        {heroMobileVideoUrl ? (
          isMobileHeroImage ? (
            <img src={heroMobileVideoUrl} alt="Hero Background" className="w-full h-full object-cover" />
          ) : (
            <video 
              ref={mobileVideoRef}
              autoPlay 
              loop 
              muted 
              playsInline
              controls={false}
              className="w-full h-full object-cover"
            >
              <source src={heroMobileVideoUrl?.toLowerCase().endsWith(".mov") && heroMobileVideoUrl.includes("res.cloudinary.com") ? heroMobileVideoUrl.replace(/\.mov$/i, ".mp4") : heroMobileVideoUrl} />
            </video>
          )
        ) : null}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#f7f7f7]"></div>
      </div>

      <div className="relative z-10 text-center px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="text-white/70 font-mono tracking-[0.4em] uppercase text-xs sm:text-sm mb-6">
            {heroSubtitle}
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center justify-center font-display font-bold leading-none tracking-tight text-white mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          <span className="text-5xl sm:text-7xl lg:text-9xl">{heroTitle1}</span>
          <span className="text-5xl sm:text-7xl lg:text-9xl">{heroTitle2}</span>
          <span className="text-5xl sm:text-7xl lg:text-9xl">{heroTitle3}</span>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce cursor-pointer flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={() => {
          document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-xs tracking-widest uppercase mb-2">{t("SCROLL")}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
      </motion.div>
    </div>
  );
}
