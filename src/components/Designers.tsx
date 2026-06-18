import { motion, AnimatePresence } from "motion/react";
import { DESIGNERS as STATIC_DESIGNERS } from "../data";
import { Instagram, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Designer } from "../types";
import { useSettings } from "../hooks/useSettings";
import { useTranslation } from "../contexts/TranslationContext";

export function Designers() {
  const { t } = useTranslation();
  const { designers = STATIC_DESIGNERS } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Carousel logic for designer pop-up

  useEffect(() => {
    if (!selectedDesigner) {
      setCurrentImageIndex(0);
      setEnlargedImage(null);
      return;
    }
    if (enlargedImage) return;

    const images = [selectedDesigner.imageUrl];
    if (selectedDesigner.imageUrls && selectedDesigner.imageUrls.length > 0) {
      images.push(...selectedDesigner.imageUrls);
    }
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedDesigner, enlargedImage]);

  const filteredDesigners = designers.filter((d: Designer) => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="designers" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-display font-light tracking-wide uppercase">{t("DESIGNERS")}</h2>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filteredDesigners.map((designer: Designer, i: number) => (
          <motion.div
            key={designer.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group cursor-pointer flex flex-col"
            onClick={() => setSelectedDesigner(designer)}
          >
            <div className="relative overflow-hidden aspect-[3/4] mb-4">
              <img 
                src={designer.imageUrl || "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=800&auto=format&fit=crop&q=60"} 
                alt={designer.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-display uppercase tracking-widest text-xl translate-y-4 group-hover:translate-y-0 transition-transform text-center px-4">
                  {designer.brand}
                </span>
              </div>
            </div>
            
            <h3 className="text-lg md:text-xl font-display font-light uppercase tracking-wide text-black">{designer.name}</h3>
          </motion.div>
        ))}
        {filteredDesigners.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 font-mono text-sm tracking-widest uppercase">
            {t("NO_DESIGNERS_FOUND")}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedDesigner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-pointer"
            onClick={() => setSelectedDesigner(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white max-w-3xl w-full p-8 md:p-12 relative flex flex-col md:flex-row gap-8 shadow-2xl overflow-y-auto scrollbar-hide max-h-[90vh] ${enlargedImage ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <button 
                onClick={() => setSelectedDesigner(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors p-2 z-10"
              >
                <X size={24} />
              </button>
              
              <div className="w-full md:w-1/2 aspect-[3/4] relative overflow-hidden bg-gray-100 flex-shrink-0 group cursor-pointer" onClick={() => setEnlargedImage([selectedDesigner.imageUrl, ...(selectedDesigner.imageUrls || [])][currentImageIndex] || selectedDesigner.imageUrl)}>
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={
                      [selectedDesigner.imageUrl, ...(selectedDesigner.imageUrls || [])][currentImageIndex] || 
                      "https://images.unsplash.com/photo-1549439602-43ebca2327af?w=800&auto=format&fit=crop&q=60"
                    } 
                    alt={selectedDesigner.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/opacity-0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 uppercase tracking-widest text-sm translate-y-4 group-hover:translate-y-0 transition-all font-display bg-black/40 px-4 py-2">
                    {t("ENLARGE")}
                  </span>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <span className="text-xs uppercase tracking-widest text-gray-500 mb-2">{selectedDesigner.brand}</span>
                <h3 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wide mb-6">
                  {selectedDesigner.name}
                </h3>
                <p className="text-gray-600 font-serif text-lg leading-relaxed mb-8">
                  {selectedDesigner.bio || "No biography available."}
                </p>
                
                {selectedDesigner.instagramUrl && (
                  <a
                    href={selectedDesigner.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-black/20 px-6 py-3 uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors w-max"
                  >
                    <Instagram size={18} />
                    <span>{t("FOLLOW_ON_INSTAGRAM")}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
            onClick={() => setEnlargedImage(null)}
          >
            <button 
              onClick={() => setEnlargedImage(null)}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors p-2 z-10"
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={enlargedImage}
              className="max-w-full max-h-[95vh] object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
