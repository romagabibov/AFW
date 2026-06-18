import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { SCHEDULE as STATIC_SCHEDULE } from "../data";
import { cn } from "../lib/utils";
import { useSettings } from "../hooks/useSettings";

import { useTranslation } from "../contexts/TranslationContext";

export function Schedule() {
  const { t } = useTranslation();
  const { schedule = STATIC_SCHEDULE } = useSettings();
  const [filter, setFilter] = useState<string>("all");
  
  const dates = Array.from(new Set(schedule.map((s: any) => s.date))).sort();
  
  const filteredSchedule = schedule.filter((item: any) => {
    if (filter === "all") return true;
    return item.date === filter;
  }).sort((a: any, b: any) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  return (
    <div id="calendar" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-2xl md:text-4xl font-display font-light tracking-wide uppercase mb-8">{t("CALENDAR")}</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-6 mb-16 border-b border-black/10 pb-4">
          <button 
            onClick={() => setFilter("all")}
            className={cn(
              "text-sm tracking-widest uppercase transition-all duration-300 pb-4 -mb-[17px] border-b-[1px]",
              filter === "all" ? "text-black border-black font-semibold" : "text-gray-400 border-transparent hover:text-gray-600"
            )}
          >
            {t("All Days")}
          </button>
          {dates.map((date: any) => (
            <button 
              key={date}
              onClick={() => setFilter(date)}
              className={cn(
                "text-sm tracking-widest uppercase transition-all duration-300 pb-4 -mb-[17px] border-b-[1px]",
                filter === date ? "text-black border-black font-semibold" : "text-gray-400 border-transparent hover:text-gray-600"
              )}
            >
              {date ? format(parseISO(date), "MMM dd") : t("TBD")}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-[1px] bg-black/5 border-t border-b border-black/10">
        <AnimatePresence mode="popLayout">
          {filteredSchedule.map((item: any, index: number) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              className="bg-white flex flex-col md:flex-row md:items-center justify-between py-8 px-4 gap-6 group hover:bg-gray-50 transition-colors duration-500"
            >
              <div className="flex flex-col md:w-1/4 gap-1">
                <span className="font-light text-xl tracking-wide text-black">{item.date ? format(parseISO(item.date), "dd.MM.yyyy") : "TBD"}</span>
                <span className="text-gray-500 font-mono text-sm">{item.time}</span>
              </div>
              
              <div className="flex-1">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{item.type}</p>
                <h3 className="text-2xl md:text-3xl font-display font-light uppercase tracking-wide text-black">{item.designerName}</h3>
              </div>

              <div className="md:w-1/4 text-right">
                <span className="text-sm tracking-widest text-gray-400 uppercase">{item.location}</span>
              </div>
            </motion.div>
          ))}
          {filteredSchedule.length === 0 && (
            <div className="bg-white py-20 text-center text-gray-500 font-mono text-sm tracking-widest uppercase">
              {t("NO_EVENTS_SCHEDULED")}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
