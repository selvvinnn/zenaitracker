import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import WaterBottle from "@/components/WaterBottle"; 
import { motion } from "framer-motion";
import { Droplet } from "lucide-react";

// 30 minutes
const REMIND_INTERVAL_MS = 30 * 60 * 1000;

// Popup length = 2 minutes
const POPUP_COUNTDOWN_SEC = 2 * 60;

const STORAGE_KEY = "zen:lastHydrationAck"; 
const STORAGE_ENABLED = "zen:hydrationEnabled";

const QUOTES = [
  "Hydrate to perform. Water fuels your focus.",
  "A hydrated mind is a productive mind — sip now.",
  "Small sips, big gains. Keep your flow.",
  "Drink water, sharpen your edge. One sip at a time.",
  "Clarity starts with hydration — take a minute to drink.",
];

const randomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

export default function HydrationReminder() {

  // from authStore
  const { user, addHydration } = useAuthStore();

  const [enabled, setEnabled] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_ENABLED) !== "false";
  });

  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(POPUP_COUNTDOWN_SEC);
  const [quote, setQuote] = useState(randomQuote());
  const [customInput, setCustomInput] = useState("");

  const countdownRef = useRef<number | null>(null);

  // --- SOUND ---
  const soundRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    soundRef.current = new Audio("/sounds/hydrate.mp3");
  }, []);

  // Notifications permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      setTimeout(() => Notification.requestPermission(), 3000);
    }
  }, []);

  // Should popup?
  function shouldTrigger() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;

    const last = parseInt(raw, 10);
    return Date.now() - last >= REMIND_INTERVAL_MS;
  }

  // Start reminder loop
  useEffect(() => {
    if (!enabled) return;

    if (shouldTrigger()) triggerPopup();

    const checkInterval = setInterval(() => {
      if (shouldTrigger()) triggerPopup();
    }, 60 * 1000);

    return () => clearInterval(checkInterval);
  }, [enabled]);

  function triggerPopup() {
    setVisible(true);
    setQuote(randomQuote());
    setCountdown(POPUP_COUNTDOWN_SEC);

    soundRef.current?.play().catch(() => {});

    // Show browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Time to Hydrate 💧", {
        body: "Take a short hydration break.",
      });
    }

    // countdown timer
    if (countdownRef.current) clearInterval(countdownRef.current);

    countdownRef.current = window.setInterval(() => {
      setCountdown((sec) => {
        if (sec <= 1) {
          handleHydrate(0); // auto-ack but no hydration added
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
  }

  // --- MAIN HYDRATION LOGIC ---
  async function handleHydrate(amount: number) {

    // Save last reminder timestamp (stops immediate re-popup)
    localStorage.setItem(STORAGE_KEY, String(Date.now()));

    if (amount > 0) {
      await addHydration(amount);
    }

    if (countdownRef.current) clearInterval(countdownRef.current);

    setVisible(false);
    setCustomInput("");
  }

  // hydration progress % for animation
  const total = user?.hydrationTodayLitres ?? 0;
  const goal = user?.dailyHydrationGoal ?? 2.0;

  // format mm:ss
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2,"0")}`;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => {
          const next = !enabled;
          setEnabled(next);
          localStorage.setItem(STORAGE_ENABLED, String(next));
        }}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-xl ${
          enabled ? "bg-zen-cyan text-black" : "bg-gray-700 text-gray-300"
        }`}
      >
        <Droplet size={22} />
      </button>

      {/* Popup */}
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Popup Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 max-w-xl w-full zen-card p-6 md:p-8 flex flex-col gap-6"
          >
            <h3 className="text-xl font-gaming text-zen-cyan">Hydration Break</h3>

            {/* Water Bottle Animation */}
            <div className="flex justify-center">
              <WaterBottle total={total} goal={goal} />
            </div>

            <p className="text-gray-300 text-center">{quote}</p>

            {/* Timer */}
            <div className="text-center text-zen-cyan font-mono text-lg">
              {formatTime(countdown)}
            </div>

            {/* Quick Hydrate Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {[0.25, 0.5, 1].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleHydrate(amt)}
                  className="py-3 text-center bg-zen-dark-primary border border-zen-cyan/30 rounded-lg text-zen-cyan hover:bg-zen-dark-secondary"
                >
                  {amt} L
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 bg-zen-dark-primary border border-zen-cyan/30 rounded-lg px-3 py-2 text-gray-200"
                placeholder="Custom (L)"
              />
              <button
                onClick={() => {
                  const val = parseFloat(customInput);
                  if (!isNaN(val) && val > 0) handleHydrate(val);
                }}
                className="px-5 py-2 bg-zen-cyan text-black rounded-lg"
              >
                Add
              </button>
            </div>

            {/* Skip Button */}
            <button
              onClick={() => handleHydrate(0)}
              className="text-gray-400 text-sm text-center mt-2"
            >
              Skip for now
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
