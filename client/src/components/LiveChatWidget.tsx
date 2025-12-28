import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

/**
 * Live Chat Widget Component
 * 
 * Provides a floating chat button that opens a contact form.
 * In a production environment, this would integrate with a live chat service
 * like Intercom, Crisp, or Zendesk.
 * 
 * For now, it collects messages and shows a "We'll respond soon" message.
 */

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSending(true);

    // Simulate sending message (in production, integrate with live chat service)
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("Message sent! We'll respond within 2 hours.");
    setMessage("");
    setEmail("");
    setIsOpen(false);
    setIsSending(false);
  };

  return (
    <>
      {/* Chat Button - Fixed bottom right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-[#1E3A5F] to-[#152B45] text-white px-5 py-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
          aria-label="Open live chat"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="font-semibold text-sm hidden sm:inline">Questions? Chat with us</span>
          {/* Notification dot */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-96 shadow-2xl border-2 border-[#C9A961] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E3A5F] to-[#152B45] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A961] flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base">Optibio Support</h3>
                <p className="text-xs text-slate-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Typically replies in minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="bg-white p-4 space-y-4 max-h-[400px] overflow-y-auto">
            {/* Welcome Message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C9A961] flex-shrink-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">O</span>
              </div>
              <div className="bg-slate-100 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                <p className="text-sm text-slate-800">
                  👋 Hi! How can we help you today? Ask us anything about our KSM-66® Ashwagandha or your order.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label htmlFor="chat-email" className="text-xs font-medium text-slate-600 mb-1 block">
                  Your Email
                </label>
                <input
                  id="chat-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A961] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="chat-message" className="text-xs font-medium text-slate-600 mb-1 block">
                  Your Message
                </label>
                <Textarea
                  id="chat-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your question here..."
                  rows={4}
                  className="w-full text-sm resize-none border-slate-300 focus:ring-[#C9A961] focus:border-transparent"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSending}
                className="w-full bg-gradient-to-r from-[#1E3A5F] to-[#152B45] hover:from-[#152B45] hover:to-[#0F1F30] text-white font-semibold"
              >
                {isSending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>

            {/* Quick Links */}
            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-600 mb-2">Quick Links:</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/faq"
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
                >
                  FAQ
                </a>
                <a
                  href="/shipping"
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
                >
                  Shipping
                </a>
                <a
                  href="/returns"
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
                >
                  Returns
                </a>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
