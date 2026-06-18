import React, { useState, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";
import { motion, AnimatePresence } from "motion/react";

export function SitePopup() {
  const { popupEnabled, popupTitle, popupContent, popupButtonEnabled, popupButtonText, popupButtonLink } = useSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already closed the popup in this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenSitePopup");
    
    // Only show if it's enabled and the user hasn't seen it yet
    if (popupEnabled && !hasSeenPopup) {
      // Small timeout to allow the rest of the site to render first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [popupEnabled]);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem("hasSeenSitePopup", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && popupEnabled && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white max-w-2xl w-full p-8 md:p-12 relative my-8 max-h-[90vh] flex flex-col"
          >
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-black uppercase tracking-widest text-xs p-2 transition-colors z-10"
            >
              Close
            </button>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {popupTitle && (
                <h2 className="text-2xl md:text-4xl font-display uppercase tracking-wide mb-8 border-b border-black/10 pb-4">
                  {popupTitle}
                </h2>
              )}
              
              <div 
                className="prose prose-sm max-w-none break-words whitespace-normal text-gray-700"
                dangerouslySetInnerHTML={{ __html: popupContent || "" }}
              />
            </div>
            
            <div className="mt-8 pt-4 border-t border-black/10 flex justify-end gap-4">
              <button 
                onClick={closePopup}
                className="border border-black/20 text-black/60 px-8 py-3 uppercase tracking-widest text-sm hover:border-black hover:text-black transition-colors"
              >
                Continue
              </button>
              {popupButtonEnabled && popupButtonText && (
                <a 
                  href={popupButtonLink || "#"} 
                  target={popupButtonLink?.startsWith("http") ? "_blank" : "_self"}
                  rel={popupButtonLink?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-black/80 transition-colors inline-block text-center"
                  onClick={(e) => {
                     if (!popupButtonLink) {
                        e.preventDefault();
                        closePopup();
                     }
                  }}
                >
                  {popupButtonText}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
