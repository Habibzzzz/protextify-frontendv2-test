import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { generateWhatsAppUrl, isWithinOperatingHours, WHATSAPP_CONFIG } from "../../utils/whatsappConfig";

const FloatingWhatsApp = () => {
  const handleWhatsAppClick = () => {
    // Cek apakah dalam jam operasional
    const message = isWithinOperatingHours() 
      ? WHATSAPP_CONFIG.defaultMessage 
      : WHATSAPP_CONFIG.afterHoursMessage;
    
    const whatsappUrl = generateWhatsAppUrl(message);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Pulse animation */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
      
      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        <div className="text-center">
          <div className="font-medium">Chat dengan kami</div>
          <div className="text-xs text-gray-300 mt-1">
            {isWithinOperatingHours() ? "Online" : "Offline"}
          </div>
        </div>
        <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
      </div>
    </motion.button>
  );
};

export default FloatingWhatsApp;
