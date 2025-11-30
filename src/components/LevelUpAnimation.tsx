import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Sparkles, Zap } from 'lucide-react';

interface LevelUpAnimationProps {
  newLevel: number;
  onComplete: () => void;
}

export default function LevelUpAnimation({ newLevel, onComplete }: LevelUpAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="text-center"
            >
              {/* Level Up Text */}
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-8"
              >
                <h1 className="zen-title text-7xl mb-4 text-zen-cyan">
                  LEVEL UP!
                </h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  className="text-6xl font-mono font-bold text-zen-gold"
                >
                  Level {newLevel}
                </motion.div>
              </motion.div>

              {/* Animated Icons */}
              <div className="flex items-center justify-center gap-8">
                <motion.div
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-16 h-16 text-zen-cyan" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="w-20 h-20 text-zen-gold" fill="currentColor" />
                </motion.div>
                <motion.div
                  animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-16 h-16 text-zen-cyan" />
                </motion.div>
              </div>

              {/* Particle Effects */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-zen-cyan rounded-full"
                  initial={{
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    opacity: 1,
                  }}
                  animate={{
                    x: window.innerWidth / 2 + (Math.random() - 0.5) * 800,
                    y: window.innerHeight / 2 + (Math.random() - 0.5) * 800,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

