import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zen-dark-primary">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-zen-cyan border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-zen-cyan font-gaming text-xl uppercase tracking-wider">
          Loading...
        </p>
      </motion.div>
    </div>
  );
}

