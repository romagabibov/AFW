import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import { useTranslation } from "../contexts/TranslationContext";

export function TeamPage() {
  const { t } = useTranslation();
  const { teamList = [] } = useSettings();
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // default fallback just in case
  const team = teamList.length > 0 ? teamList : [
    { id: 1, name: "Nigar Abbasova", role: "Creative Director", bio: "With over 15 years in fashion management.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60" },
    { id: 2, name: "Elvin Mammadov", role: "Head of Production", bio: "Ensuring the technical excellence of every show.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60" },
    { id: 3, name: "Aysel Rustamova", role: "PR & Media", bio: "Connecting our brand with global media.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60" },
  ];

  return (
    <div className="pt-32 pb-24 px-4 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wide mb-16 text-center">{t("TEAM")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member, i) => (
          <motion.div 
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer relative overflow-hidden aspect-[3/4]"
            onClick={() => setSelectedMember(member)}
          >
            <img src={member.image || undefined} alt={member.name} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-6 text-center">
              <h3 className="text-2xl font-display uppercase tracking-wide mb-2 translate-y-4 group-hover:translate-y-0 transition-transform">{member.name}</h3>
              <p className="text-sm tracking-widest uppercase opacity-70 translate-y-4 group-hover:translate-y-0 transition-transform delay-75">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-black/10 p-6 md:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-black/50 hover:text-black transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left mt-6 md:mt-0">
                <img src={selectedMember.image || undefined} alt={selectedMember.name} className="w-2/3 md:w-1/3 max-w-[200px] md:max-w-xs shrink-0 aspect-[3/4] object-cover grayscale shadow-md" />
                <div className="flex-1">
                  <h2 className="text-3xl font-display uppercase tracking-wide mb-2">{selectedMember.name}</h2>
                  <p className="text-gray-500 tracking-widest uppercase text-sm mb-6 pb-6 border-b border-black/10">{selectedMember.role}</p>
                  <p className="text-gray-700 leading-relaxed font-light">{selectedMember.bio}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
