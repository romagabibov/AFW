import React from "react";
import { useSettings } from "../hooks/useSettings";
import { useTranslation } from "../contexts/TranslationContext";

export function PrivacyPage() {
  const { privacyPolicy = "Privacy Policy\n\nYour privacy policy text goes here..." } = useSettings();
  const { t } = useTranslation();

  return (
    <div className="pt-32 pb-24 px-4 lg:px-8 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wide mb-12 text-center">{t("PRIVACY_POLICY")}</h1>
      <div className="prose prose-sm md:prose-base prose-gray max-w-none whitespace-pre-wrap">
        {privacyPolicy}
      </div>
    </div>
  );
}
