import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send } from "lucide-react";

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Welcome to AFW 2026. How can we help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, isBot: false }]);
    setInput("");
    
    // Simulate generic bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), text: "An agent will be with you shortly.", isBot: true }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-cyan hover:bg-brand-blue rounded-full shadow-lg shadow-brand-cyan/20 flex items-center justify-center text-white z-50 transition-transform hover:scale-110"
        style={{ display: isOpen ? "none" : "flex" }}
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[350px] h-[500px] glass bg-brand-midnight/90 border border-brand-cyan/20 rounded-2xl flex flex-col z-50 overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="font-medium text-sm">Live Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col pt-6">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.isBot ? "bg-white/10 self-start rounded-tl-sm text-gray-200" : "bg-brand-cyan text-white self-end rounded-tr-sm"}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="w-full bg-brand-midnight border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-brand-cyan/50 text-white"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-cyan flex items-center justify-center hover:bg-brand-blue transition-colors"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
