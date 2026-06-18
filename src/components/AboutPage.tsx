import { motion } from "motion/react";
import { useTranslation } from "../contexts/TranslationContext";

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="pt-32 pb-24 px-4 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wide mb-16 text-center">{t("ABOUT")}</h1>
      
      <div className="space-y-12 text-black/80 font-serif text-lg leading-relaxed">
        <p>
          {t("ABOUT_P1")}
        </p>
        <p>
          {t("ABOUT_P2")}
        </p>
        <p>
          {t("ABOUT_P3")}
        </p>
        <div className="mt-16 pt-8 border-t border-black/10">
          <h2 className="text-xl md:text-2xl font-display tracking-widest uppercase mb-6 text-black">{t("OUR_MISSION")}</h2>
          <ul className="list-disc pl-6 space-y-4 font-sans text-base">
            <li>{t("MISSION_1")}</li>
            <li>{t("MISSION_2")}</li>
            <li>{t("MISSION_3")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
