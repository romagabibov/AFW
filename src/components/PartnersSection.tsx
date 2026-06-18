import { motion } from "motion/react";
import { useSettings } from "../hooks/useSettings";
import { useTranslation } from "../contexts/TranslationContext";

export function PartnersSection() {
  const { t } = useTranslation();
  const { partners = [] } = useSettings();

  const displayPartners = partners && partners.length > 0 ? partners : [
    { id: 1, name: "Partner 1" },
    { id: 2, name: "Partner 2" },
    { id: 3, name: "Partner 3" },
    { id: 4, name: "Partner 4" },
    { id: 5, name: "Partner 5" },
    { id: 6, name: "Partner 6" }
  ];

  // We duplicate the array to create a seamless infinite scroll effect
  const marqueeItems = [...displayPartners, ...displayPartners, ...displayPartners, ...displayPartners];

  return (
    <section id="partners" className="py-24 overflow-hidden border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-12">
        <h2 className="text-2xl md:text-3xl font-display font-light uppercase tracking-wide">{t("PARTNERS")}</h2>
      </div>
      
      <div className="relative w-full overflow-hidden flex fill-mode-forwards group">
        <motion.div 
          className="flex whitespace-nowrap min-w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 65
          }}
        >
          {marqueeItems.map((partner: any, i: number) => (
            <div 
              key={`${partner.id || partner.name}-${i}`}
              className="flex items-center justify-center min-w-[200px] h-[100px] px-8 mx-4"
            >
              {partner.logo && partner.logo.trim() !== "" ? (
                <img src={partner.logo || undefined} alt={partner.name || `Partner ${i}`} className="max-w-[150px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              ) : (
                <span className="text-gray-400 font-mono uppercase tracking-widest text-sm grayscale hover:grayscale-0 transition-all duration-300">{partner.name || "Partner Logo"}</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
