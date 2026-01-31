import { useEffect } from "react";

/**
 * Crisp Live Chat Widget
 * 
 * Free tier includes:
 * - Unlimited conversations
 * - 2 seats
 * - Mobile apps
 * - Email integration
 * 
 * Setup instructions:
 * 1. Sign up at https://crisp.chat
 * 2. Get your website ID from Settings > Website Settings
 * 3. Replace 'YOUR_WEBSITE_ID' below with your actual website ID
 * 
 * The widget will appear as a chat bubble in the bottom-right corner
 */

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

interface CrispChatProps {
  /**
   * Your Crisp website ID (found in Crisp dashboard)
   * Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   */
  websiteId?: string;
}

export default function CrispChat({ websiteId = "YOUR_WEBSITE_ID" }: CrispChatProps) {
  useEffect(() => {
    // Skip if already loaded or in development without real ID
    if (window.$crisp || websiteId === "YOUR_WEBSITE_ID") {
      return;
    }

    // Initialize Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;

    // Load Crisp script
    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.getElementsByTagName("head")[0].appendChild(script);

    // Cleanup
    return () => {
      // Remove Crisp when component unmounts (optional)
      if (window.$crisp) {
        window.$crisp.push(["do", "chat:hide"]);
      }
    };
  }, [websiteId]);

  return null; // This component doesn't render anything visible
}

/**
 * Helper functions to control Crisp programmatically
 * Import these where needed:
 * 
 * import { showCrispChat, hideCrispChat, openCrispChat } from '@/components/CrispChat';
 */

export const showCrispChat = () => {
  if (window.$crisp) {
    window.$crisp.push(["do", "chat:show"]);
  }
};

export const hideCrispChat = () => {
  if (window.$crisp) {
    window.$crisp.push(["do", "chat:hide"]);
  }
};

export const openCrispChat = () => {
  if (window.$crisp) {
    window.$crisp.push(["do", "chat:open"]);
  }
};

export const closeCrispChat = () => {
  if (window.$crisp) {
    window.$crisp.push(["do", "chat:close"]);
  }
};

/**
 * Set user data for better support experience
 */
export const setCrispUserData = (email: string, name?: string) => {
  if (window.$crisp) {
    window.$crisp.push(["set", "user:email", [email]]);
    if (name) {
      window.$crisp.push(["set", "user:nickname", [name]]);
    }
  }
};
