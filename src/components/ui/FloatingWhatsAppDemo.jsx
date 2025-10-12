import { useState } from "react";
import { MessageCircle, Settings, Clock, CheckCircle } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "./index";
import FloatingWhatsApp from "./FloatingWhatsApp";
import { WHATSAPP_CONFIG, isWithinOperatingHours } from "../../utils/whatsappConfig";

// Demo component untuk testing FloatingWhatsApp
const FloatingWhatsAppDemo = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <span>Floating WhatsApp Button Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Floating WhatsApp button sudah terintegrasi di semua halaman. 
            Button akan muncul di pojok kanan bawah dengan animasi yang smooth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Konfigurasi Saat Ini:</h4>
              <div className="text-sm space-y-1">
                <p><strong>Nomor:</strong> {WHATSAPP_CONFIG.phoneNumber}</p>
                <p><strong>Tim Support:</strong> {WHATSAPP_CONFIG.supportTeamName}</p>
                <p><strong>Jam Operasional:</strong> {WHATSAPP_CONFIG.operatingHours}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Status Saat Ini:</h4>
              <div className="flex items-center space-x-2">
                {isWithinOperatingHours() ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">Online</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-600">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Pesan Default:</h4>
            <p className="text-sm text-gray-700 italic">
              "{isWithinOperatingHours() 
                ? WHATSAPP_CONFIG.defaultMessage 
                : WHATSAPP_CONFIG.afterHoursMessage}"
            </p>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={() => setShowDemo(!showDemo)}
              variant="outline"
              size="sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showDemo ? "Sembunyikan" : "Tampilkan"} Demo
            </Button>
          </div>

          {showDemo && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Demo Area:</strong> Scroll ke bawah untuk melihat floating button di pojok kanan bawah
              </p>
              <div className="h-96 bg-white rounded border flex items-center justify-center">
                <p className="text-gray-500">Area demo - Floating button ada di pojok kanan bawah</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating WhatsApp Button - akan muncul di pojok kanan bawah */}
      <FloatingWhatsApp />
    </div>
  );
};

export default FloatingWhatsAppDemo;
