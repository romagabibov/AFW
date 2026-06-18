import React, { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { useTranslation } from "../contexts/TranslationContext";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export function MediaPage() {
  const { t } = useTranslation();
  const { mediaDays = [], mediaPublications = [] } = useSettings();
  
  const [activeTab, setActiveTab] = useState<"news" | "assets">(() => {
    if (mediaPublications.length > 0) return "news";
    if (mediaDays.length > 0) return "assets";
    return "news";
  });
  
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  return (
    <div className="pt-32 pb-24 px-4 lg:px-8 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wide mb-16 text-center">{t("MEDIA_GALLERY")}</h1>
      
      {mediaDays.length === 0 && mediaPublications.length === 0 ? (
        <div className="text-center text-gray-500 uppercase tracking-widest text-sm mt-20">{t("MEDIA_COMING_SOON") || "COMING SOON"}</div>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-center gap-8 md:gap-16 mb-12 border-b border-black/10">
            {mediaPublications.length > 0 && (
              <button 
                onClick={() => setActiveTab("news")}
                className={`pb-4 uppercase tracking-widest text-sm md:text-base font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === "news" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"}`}
              >
                News & Publications
              </button>
            )}
            {mediaDays.length > 0 && (
              <button 
                onClick={() => setActiveTab("assets")}
                className={`pb-4 uppercase tracking-widest text-sm md:text-base font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === "assets" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"}`}
              >
                Photo & Video Assets
              </button>
            )}
          </div>
          
          {/* News & Publications Section */}
          {activeTab === "news" && mediaPublications.length > 0 && (
            <section className="animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[150px] md:auto-rows-[250px]">
                {mediaPublications.map((pub: any) => {
                  const sizeClasses = {
                    small: "col-span-1 row-span-1",
                    medium: "col-span-2 row-span-1 border",
                    large: "col-span-2 row-span-2 md:col-span-2 md:row-span-2"
                  }[pub.size as string] || "col-span-1 row-span-1";

                  const isImageOrVideoUrl = pub.url?.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|svg)$/i) || pub.url?.includes("res.cloudinary.com");
                  const isPdf = pub.url?.match(/\.pdf($|\?)/i);
                  
                  let thumbnailUrl = pub.url ? `https://image.thum.io/get/width/600/crop/600/${pub.url}` : undefined;
                  if (isImageOrVideoUrl && !isPdf) {
                    thumbnailUrl = pub.url;
                  } else if (isPdf && pub.url.includes("res.cloudinary.com")) {
                    // Cloudinary can generate pdf thumbnails by changing the extension to .jpg
                    thumbnailUrl = pub.url.replace(/\.pdf$/i, ".jpg");
                  }

                  return (
                    <a 
                      key={pub.id} 
                      href={isPdf ? undefined : pub.url}
                      onClick={isPdf ? (e) => { e.preventDefault(); setSelectedPdf(pub.url); } : undefined}
                      target={isPdf ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className={`group block relative overflow-hidden bg-gray-50 border border-black/10 cursor-pointer ${sizeClasses}`}
                    >
                      {isPdf && !pub.url.includes("res.cloudinary.com") ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 group-hover:scale-105 transition-all duration-700">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </div>
                      ) : (
                        <img 
                          src={thumbnailUrl} 
                          alt={pub.title} 
                          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white font-display uppercase tracking-wide text-sm md:text-xl">{pub.title}</h3>
                        <span className="text-brand-cyan text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
                          <span>Read Article</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}
          
          {/* Photo Links Section */}
          {activeTab === "assets" && mediaDays.length > 0 && (
            <section className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mediaDays.map((day: any) => (
                  <div key={day.id} className="bg-gray-50 border border-black/10 p-8 flex flex-col items-center text-center">
                    <h3 className="text-xl font-display uppercase tracking-wide mb-6">{day.date || t("UNNAMED_DAY")}</h3>
                    
                    {day.links && day.links.length > 0 ? (
                      <div className="flex flex-col gap-3 w-full">
                        {day.links.map((link: any, i: number) => (
                          <a 
                            key={link.id || i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border border-black/10 p-4 flex items-center justify-between group hover:border-black transition-colors w-full"
                          >
                            <span className="text-xs font-medium uppercase tracking-widest text-black/80 group-hover:text-black block truncate mr-2">{link.label || t("DOWNLOAD_LINK")}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-black transition-colors shrink-0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center w-full my-8">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500">{t("NO_MEDIA_LINKS")}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          
        </div>
      )}

      <AnimatePresence>
        {selectedPdf && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pt-20"
             onClick={() => setSelectedPdf(null)}
           >
             <button 
               onClick={() => setSelectedPdf(null)}
               className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 z-[60]"
             >
               <X size={32} />
             </button>
             <motion.div
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               onClick={(e) => e.stopPropagation()}
               className="bg-white w-full max-w-5xl h-[85vh] relative shadow-2xl rounded-sm overflow-hidden"
             >
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedPdf)}&embedded=true`} 
                  className="w-full h-full border-none" 
                  title="PDF Viewer"
                />
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
