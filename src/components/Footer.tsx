import React from "react";
import { useTranslation } from "../contexts/TranslationContext";
import { Link } from "react-router-dom";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white pt-16 pb-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="font-display font-bold leading-none tracking-tight text-white uppercase mb-4">
            <span className="block text-xl">AZERBAIJAN</span>
            <span className="block text-xl">FASHION</span>
            <span className="block text-xl">WEEK</span>
          </div>
          <p className="text-gray-400 text-sm tracking-wide leading-relaxed">
            {t("FOOTER_DESC")}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs tracking-widest uppercase text-gray-500 mb-2">{t("EXPLORE")}</span>
            <Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors">{t("ABOUT")}</Link>
            <Link to="/designers" className="text-sm text-gray-300 hover:text-white transition-colors">{t("DESIGNERS")}</Link>
            <Link to="/news" className="text-sm text-gray-300 hover:text-white transition-colors">{t("NEWS")}</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs tracking-widest uppercase text-gray-500 mb-2">{t("ENGAGE")}</span>
            <Link to="/apply" className="text-sm text-gray-300 hover:text-white transition-colors">{t("APPLY")}</Link>
            <Link to="/partners" className="text-sm text-gray-300 hover:text-white transition-colors">{t("PARTNERS")}</Link>
            <Link to="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">{t("CONTACT")}</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs tracking-widest uppercase text-gray-500 mb-2">{t("SOCIAL")}</span>
            <a href="https://www.instagram.com/azerbaijanfashionweek/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">Instagram</a>
            <a href="https://www.facebook.com/AzerbaijanFashionWeek/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">Facebook</a>
            <a href="https://www.youtube.com/@AzerbaijanFashionWeek?app=desktop" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">YouTube</a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 tracking-widest uppercase">
        <span>&copy; {new Date().getFullYear()} AZERBAIJAN FASHION WEEK | <a href="https://coyora.studio/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">Powered by coyora.studio</a></span>
        <div className="flex space-x-6">
          <Link to="/privacy" className="hover:text-gray-300 transition-colors">{t("PRIVACY_POLICY")}</Link>
          <Link to="/terms" className="hover:text-gray-300 transition-colors">{t("TERMS_OF_SERVICE")}</Link>
        </div>
      </div>
    </footer>
  );
}
