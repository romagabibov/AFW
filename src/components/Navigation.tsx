import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "../contexts/TranslationContext";
import { useSettings } from "../hooks/useSettings";

export function Navigation() {
  const { language, setLanguage, t } = useTranslation();
  const { logoUrl, heroVideoUrl } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeroImage = heroVideoUrl?.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || !heroVideoUrl?.match(/\.(mp4|webm|ogg)/i) && heroVideoUrl?.includes("res.cloudinary.com");
  const isHomePage = location.pathname === "/";
  // The area is dark only if it's the home page without an image background (so video) and not scrolled
  const isDarkArea = !scrolled && isHomePage && !isHeroImage; 
  
  // Force white glass if we are at home with an image, or when scrolled
  const hasGlassBackground = scrolled || (isHomePage && isHeroImage);

  const navItems = [
    { id: "/", label: "HOME", action: "route" },
    { id: "calendar", label: "CALENDAR", action: "scroll" },
    { id: "designers", label: "DESIGNERS", action: "scroll" },
    { id: "partners", label: "PARTNERS", action: "scroll" },
    { id: "/news", label: "NEWS", action: "route" },
    { id: "/team", label: "TEAM", action: "route" },
    { id: "/media", label: "MEDIA", action: "route" },
    { id: "/apply", label: "APPLY", action: "route" },
    { id: "/about", label: "ABOUT", action: "route" },
    { id: "/contact", label: "CONTACT", action: "route" },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setMobileMenuOpen(false);
    if (item.action === "newTab") {
      window.open(item.id, "_blank");
    } else if (item.action === "route") {
      navigate(item.id);
      window.scrollTo(0,0);
    } else if (item.action === "scroll") {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleLanguage = () => {
    if (language === 'EN') setLanguage('AZ');
    else if (language === 'AZ') setLanguage('RU');
    else setLanguage('EN');
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        hasGlassBackground ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-2.5 shadow-sm" : "bg-transparent border-b border-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div 
          className={cn(
            "cursor-pointer flex flex-col font-display font-bold leading-none tracking-tight hover:opacity-80 transition-opacity",
            isDarkArea ? "text-white" : "text-black"
          )}
          onClick={() => { navigate("/"); window.scrollTo(0,0); }}
          style={{ textTransform: 'uppercase' }}
        >
          {logoUrl ? (
            <img 
              src={logoUrl || undefined} 
              alt="Logo" 
              className={cn(
                "h-8 md:h-10 object-contain transition-all duration-300",
                !isDarkArea && "invert"
              )} 
            />
          ) : (
            <>
              <span className="text-lg md:text-xl">AZERBAIJAN</span>
              <span className="text-lg md:text-xl">FASHION</span>
              <span className="text-lg md:text-xl">WEEK</span>
            </>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={cn(
                "text-xs tracking-widest font-medium transition-colors uppercase",
                isDarkArea 
                  ? "text-gray-300 hover:text-white" 
                  : "text-gray-600 hover:text-black"
              )}
            >
              {t(item.label)}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button className={cn("transition-colors", isDarkArea ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <div className={cn("flex items-center gap-2 text-xs font-medium cursor-pointer transition-colors", isDarkArea ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black")} onClick={toggleLanguage}>
            <Globe size={16} />
            <span>{language}</span>
          </div>
        </div>

        {/* Mobile Actions & Toggle */}
        <div className="flex xl:hidden items-center gap-4">
          <div className={cn("flex items-center gap-2 text-xs font-medium cursor-pointer transition-colors", isDarkArea ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black")} onClick={toggleLanguage}>
            <Globe size={16} />
            <span>{language}</span>
          </div>
          <button 
            className={cn(isDarkArea ? "text-white" : "text-black")}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden fixed inset-0 top-[70px] bg-white overflow-y-auto z-40"
          >
            <div className="flex flex-col px-6 py-8 gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className="text-left text-2xl font-display font-light tracking-wide uppercase text-black hover:text-brand-cyan"
                >
                  {t(item.label)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
