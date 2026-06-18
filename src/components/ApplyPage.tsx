import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "../hooks/useSettings";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Check, X } from "lucide-react";
import { useTranslation } from "../contexts/TranslationContext";

export function ApplyPage() {
  const { t } = useTranslation();
  const { applyHeading } = useSettings();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyType, setApplyType] = useState("Designer Application");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [phone, setPhone] = useState("");
  const [igUrl, setIgUrl] = useState("");
  const [comments, setComments] = useState("");
  const [requestType, setRequestType] = useState("Standard");
  const [role, setRole] = useState("");
  const [coverageFormat, setCoverageFormat] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !brand) return;
    
    setIsSubmitting(true);
    
    try {
      const newResponse = {
        type: applyType,
        timestamp: new Date().toISOString(),
        name,
        email,
        brand,
        phone,
        igUrl,
        comments,
        requestType,
        role,
        coverageFormat
      };
      
      await addDoc(collection(db, "responses"), newResponse);
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setShowApplyModal(false);
        setName(""); setEmail(""); setBrand(""); setPhone(""); setIgUrl(""); setComments(""); setRequestType("Standard"); setRole(""); setCoverageFormat("");
      }, 2000);
    } catch (err) {
      console.error("Failed to submit", err);
      alert(t("SOMETHING_WENT_WRONG"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pt-32 pb-24 px-4 lg:px-8 max-w-4xl mx-auto min-h-screen">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wide mb-4">
          {t("BECOME_PART")} {applyHeading} {t("SEASON")}
        </h1>
        <p className="text-gray-500 uppercase tracking-widest text-sm">{t("JOIN_AFW")}</p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        <motion.button 
          onClick={() => { setApplyType("Designer Application"); setShowApplyModal(true); }}
          className="border border-black/10 p-8 flex flex-col items-center justify-center text-center hover:bg-black hover:text-white transition-colors group cursor-pointer w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-display uppercase tracking-widest mb-4">{t("DESIGNERS")}</h3>
          <p className="text-sm opacity-60 uppercase">{t("APPLICATION_FORM")}</p>
        </motion.button>

        <motion.button 
          onClick={() => { setApplyType("Media Accreditation"); setShowApplyModal(true); }}
          className="border border-black/10 p-8 flex flex-col items-center justify-center text-center hover:bg-black hover:text-white transition-colors group cursor-pointer w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-display uppercase tracking-widest mb-4">{t("MEDIA")}</h3>
          <p className="text-sm opacity-60 uppercase">{t("ACCREDITATION")}</p>
        </motion.button>

        <motion.button 
          onClick={() => setShowConfirm(true)}
          className="border border-black/10 p-8 flex flex-col items-center justify-center text-center hover:bg-black hover:text-white transition-colors group cursor-pointer w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-display uppercase tracking-widest mb-4">{t("VOLUNTEERS")}</h3>
          <p className="text-sm opacity-60 uppercase">{t("JOIN_TEAM")}</p>
        </motion.button>
      </div>

      <AnimatePresence>
        {showApplyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-black/10 p-8 w-full max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-display uppercase tracking-wide mb-8">{t("APPLICATION_FORM")}</h2>
              
              {isSubmitted ? (
                 <div className="flex flex-col items-center justify-center py-12 gap-4">
                   <div className="h-16 w-16 bg-black text-white rounded-full flex items-center justify-center">
                     <Check size={32} />
                   </div>
                   <h3 className="uppercase tracking-widest text-lg font-medium text-center">{t("APPLICATION_RECEIVED")}</h3>
                   <p className="text-sm text-gray-500 tracking-widest uppercase text-center mt-2">{t("WILL_CONTACT_SOON")}</p>
                 </div>
              ) : (
                <form className="space-y-6" onSubmit={handleApply}>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">{applyType === "Media Accreditation" ? "Media Outlet Name" : "Brand Name"}</label>
                    <input required value={brand || ""} onChange={e=>setBrand(e.target.value)} type="text" className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Your Full Name</label>
                    <input required value={name || ""} onChange={e=>setName(e.target.value)} type="text" className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email</label>
                    <input required value={email || ""} onChange={e=>setEmail(e.target.value)} type="email" className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" />
                  </div>
                  {applyType === "Media Accreditation" ? (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Job Title / Role (e.g. Photographer, Editor)</label>
                        <input value={role || ""} onChange={e=>setRole(e.target.value)} type="text" className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                        <input value={phone || ""} onChange={e=>setPhone(e.target.value)} type="tel" className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Portfolio / Link to coverage</label>
                        <input value={igUrl || ""} onChange={e=>setIgUrl(e.target.value)} type="text" className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Expected Coverage Format</label>
                        <input value={coverageFormat || ""} onChange={e=>setCoverageFormat(e.target.value)} type="text" placeholder="Print, Online, Video etc." className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Comments (Dates attending, etc)</label>
                        <textarea value={comments || ""} onChange={e=>setComments(e.target.value)} className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" rows={2} />
                      </div>
                    </>
                  ) : applyType === "Designer Application" ? (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">IG Profile Link</label>
                        <input value={igUrl || ""} onChange={e=>setIgUrl(e.target.value)} type="text" className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                        <input value={phone || ""} onChange={e=>setPhone(e.target.value)} type="tel" className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Comments</label>
                        <textarea value={comments || ""} onChange={e=>setComments(e.target.value)} className="w-full border-b border-black/20 pb-2 focus:outline-none focus:border-black bg-transparent" rows={2} />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Type of request</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="Standard" checked={requestType === "Standard"} onChange={e=>setRequestType(e.target.value)} className="accent-black" />
                            <span className="text-sm">Standard</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="Showroom" checked={requestType === "Showroom"} onChange={e=>setRequestType(e.target.value)} className="accent-black" />
                            <span className="text-sm">Showroom</span>
                          </label>
                        </div>
                      </div>
                    </>
                  ) : null}
                  <button disabled={isSubmitting} type="submit" className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-black/80 transition-colors w-full mt-8 disabled:opacity-50">
                    {isSubmitting ? t("SUBMITTING") : t("SUBMIT_APPLICATION")}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}

        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-black/10 p-8 w-full max-w-sm text-center shadow-2xl"
            >
              <h2 className="text-xl font-display uppercase tracking-wide mb-6">{t("REDIRECTING_TO_PARTNER")}</h2>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-2 border border-black/20 text-gray-500 uppercase tracking-widest text-xs hover:border-black hover:text-black transition-colors"
                >
                  {t("CANCEL")}
                </button>
                <a 
                  href="https://coyora.studio/volunteer"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-2 bg-black text-white uppercase tracking-widest text-xs hover:bg-black/80 transition-colors cursor-pointer"
                >
                  {t("CONTINUE")}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
