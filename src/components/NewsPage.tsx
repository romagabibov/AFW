import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { useTranslation } from "../contexts/TranslationContext";

export function NewsPage() {
  const { t } = useTranslation();
  const { newsList = [] } = useSettings();
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // fallback if none
  const newsItems = newsList.length > 0 ? newsList : [
    { id: 1, date: "October 11, 2026", title: "Important update regarding upcoming season schedule", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor." }
  ];

  if (selectedNews) {
    return (
      <div className="pt-32 pb-24 px-4 lg:px-8 max-w-6xl mx-auto min-h-screen w-full overflow-hidden">
        <button 
          onClick={() => setSelectedNews(null)}
          className="text-xs uppercase tracking-widest text-gray-500 hover:text-black mb-12 flex items-center gap-2"
        >
          &larr; {t("BACK_TO_NEWS")}
        </button>
        <span className="text-xs uppercase tracking-widest text-gray-400 mb-4 block">{selectedNews.date}</span>
        <h1 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wide mb-12 break-words max-w-full">{selectedNews.title}</h1>
        
            <div className="flex flex-col md:flex-row gap-12 w-full max-w-full">
          {selectedNews.coverImage && (
            <div className="w-full md:w-1/2 lg:w-1/2 shrink-0 relative">
               <div className="sticky top-32">
                 <img src={selectedNews.coverImage || undefined} alt={selectedNews.title} className="w-full h-auto object-contain shadow-lg" />
               </div>
            </div>
          )}
          <div className="flex-1 min-w-0 w-full max-w-full" style={{ paddingBottom: '10vh' }}>
            <div className="news-content-wrapper max-w-full w-full">
              {/* We assume the HTML has been sanitized initially or we trust the admin */}
              <div dangerouslySetInnerHTML={{ __html: selectedNews.content }} />
            </div>
            
            {selectedNews.gallery && selectedNews.gallery.length > 0 && (
              <div className="mt-16 border-t border-black/10 pt-12">
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Media Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {selectedNews.gallery.map((img: string, idx: number) => (
                    <div 
                      key={idx} 
                      className="cursor-pointer group aspect-square relative bg-gray-100 overflow-hidden border border-black/10 flex items-center justify-center bg-black" 
                      onClick={() => setLightboxIndex(idx)}
                    >
                      {img?.match(/\.(mp4|webm|ogg)$/i) ? (
                        <>
                          <video src={img} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" muted playsInline />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/40 transition-colors">
                              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <img src={img || undefined} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {lightboxIndex !== null && selectedNews.gallery && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
            >
              <button 
                onClick={() => setLightboxIndex(null)}
                className="absolute top-8 right-8 text-black/60 hover:text-black uppercase tracking-widest text-xs z-10"
              >
                Close
              </button>
              
              {selectedNews.gallery.length > 1 && (
                <>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev: number) => prev === 0 ? selectedNews.gallery.length - 1 : prev - 1);
                    }}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 text-black/40 hover:text-black transition-colors z-10 text-2xl"
                  >
                    &larr;
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev: number) => prev === selectedNews.gallery.length - 1 ? 0 : prev + 1);
                    }}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 text-black/40 hover:text-black transition-colors z-10 text-2xl"
                  >
                    &rarr;
                  </button>
                </>
              )}
              
              <div 
                className="relative w-full max-w-[95vw] h-full flex items-center justify-center"
                onClick={() => setLightboxIndex(null)}
              >
                {selectedNews.gallery[lightboxIndex]?.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video 
                    src={selectedNews.gallery[lightboxIndex]} 
                    className="w-full max-h-[85vh] object-contain drop-shadow-2xl bg-black/20" 
                    controls 
                    autoPlay 
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <img 
                    src={selectedNews.gallery[lightboxIndex] || undefined} 
                    className="w-full max-h-[85vh] object-contain drop-shadow-2xl" 
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 lg:px-8 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wide mb-16 text-center">{t("NEWS")}</h1>
      <div className="space-y-12">
        {newsItems.map((item: any, i: number) => (
          <motion.div 
            key={item.id || i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer border-b border-black/10 pb-12 w-full"
            onClick={() => setSelectedNews(item)}
          >
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-full">
              {item.coverImage && (
                <div className="w-full md:w-1/3 shrink-0">
                   <div className="w-full overflow-hidden">
                     <img src={item.coverImage || undefined} alt={item.title} className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105" />
                   </div>
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center min-w-0 w-full overflow-hidden">
                <span className="text-xs uppercase tracking-widest text-gray-500 mb-2 truncate max-w-full">{item.date}</span>
                <h2 className="text-2xl font-display uppercase tracking-wide mb-4 group-hover:text-black/60 transition-colors break-words">{item.title}</h2>
                <div 
                  className="text-gray-600 line-clamp-3 text-sm break-words overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
