import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useTranslation } from "../contexts/TranslationContext";

export function ContactPage() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setIsSubmitting(true);
    
    try {
      const newResponse = {
        type: "Contact Form",
        timestamp: new Date().toISOString(),
        name,
        email,
        message
      };
      
      await addDoc(collection(db, "responses"), newResponse);
      
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error("Failed to submit", err);
      alert(t("SOMETHING_WENT_WRONG"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 lg:px-8 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wide mb-16 text-center">{t("CONTACT_US")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div>
          <h2 className="text-xl md:text-2xl font-light mb-8">General Inquiries</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 w-full mb-1">afw.az</h3>
              <a href="mailto:office@afw.az" className="text-lg hover:text-gray-600 transition-colors">office@afw.az</a>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 w-full mb-1">Collab</h3>
              <a href="mailto:collab@afw.az" className="text-lg hover:text-gray-600 transition-colors">collab@afw.az</a>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 w-full mb-1">Contact</h3>
              <a href="mailto:contact@afw.az" className="text-lg hover:text-gray-600 transition-colors">contact@afw.az</a>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 w-full mb-1">Info</h3>
              <a href="mailto:info@afw.az" className="text-lg hover:text-gray-600 transition-colors">info@afw.az</a>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 w-full mb-1">Press</h3>
              <a href="mailto:press@afw.az" className="text-lg hover:text-gray-600 transition-colors">press@afw.az</a>
            </div>
          </div>
        </div>

        <form className="space-y-8 md:mt-2" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{t("NAME")}</label>
          <input value={name || ""} onChange={e => setName(e.target.value)} type="text" className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" placeholder={t("YOUR_NAME_PLACEHOLDER")} required />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{t("EMAIL")}</label>
          <input value={email || ""} onChange={e => setEmail(e.target.value)} type="email" className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" placeholder={t("YOUR_EMAIL_PLACEHOLDER")} required />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{t("MESSAGE")}</label>
          <textarea value={message || ""} onChange={e => setMessage(e.target.value)} rows={4} className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent resize-none" placeholder={t("HOW_CAN_WE_HELP")} required></textarea>
        </div>
        <button disabled={isSubmitting} className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-black/80 transition-colors w-full md:w-auto flex items-center justify-center min-w-[200px] h-[48px] disabled:opacity-50">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Check size={18} />
                <span>{t("SENT")}</span>
              </motion.div>
            ) : (
              <motion.span
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isSubmitting ? t("SENDING") : t("SEND_MESSAGE")}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </form>
      </div>
    </div>
  );
}
