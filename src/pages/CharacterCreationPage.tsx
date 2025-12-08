import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { Character } from '@/types';
import { Sparkles, Zap } from 'lucide-react';

const AVATARS = [
  { type: 'warrior', label: 'Warrior', icon: '⚔️' },
  { type: 'mage', label: 'Mage', icon: '🔮' },
  { type: 'assassin', label: 'Assassin', icon: '🗡️' },
  { type: 'archer', label: 'Archer', icon: '🏹' },
  { type: 'knight', label: 'Knight', icon: '🛡️' },
  { type: 'berserker', label: 'Berserker', icon: '⚡' },
] as const;

const THEMES = [
  { color: 'blue', label: 'Azure', class: 'from-blue-500 to-cyan-500' },
  { color: 'purple', label: 'Violet', class: 'from-purple-500 to-pink-500' },
  { color: 'red', label: 'Crimson', class: 'from-red-500 to-orange-500' },
  { color: 'gold', label: 'Golden', class: 'from-yellow-500 to-amber-500' },
  { color: 'green', label: 'Emerald', class: 'from-green-500 to-emerald-500' },
] as const;

export default function CharacterCreationPage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [hunterName, setHunterName] = useState(user?.character?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.character?.avatar || 'warrior');
  const [selectedTheme, setSelectedTheme] = useState(user?.character?.theme || 'blue');

  // NEW → Personality state
  const [selectedPersonality, setSelectedPersonality] = useState(
    user?.personality || 'general'
  );

  const handleSubmit = async () => {
    if (!hunterName.trim()) {
      toast.error('Please enter a Hunter Name');
      return;
    }

    try {
      const updatedCharacter: Partial<Character> = {
        name: hunterName.trim(),
        avatar: selectedAvatar,
        theme: selectedTheme,
      };

      await updateUser({
        character: { ...user!.character, ...updatedCharacter },
        personality: selectedPersonality,
      });

      toast.success('Character created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create character');
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="zen-card p-8 w-full max-w-4xl relative overflow-hidden"
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-zen-cyan/50" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-zen-cyan/50" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-zen-cyan/50" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-zen-cyan/50" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-12 h-12 text-zen-cyan" />
            </motion.div>

            <h1 className="zen-title text-4xl mb-2">CREATE YOUR HUNTER</h1>
            <p className="text-gray-400 font-gaming uppercase tracking-wider">
              Customize Your Character
            </p>
          </div>

          <div className="space-y-8">

            {/* Hunter Name */}
            <div>
              <label className="block text-zen-cyan font-gaming text-lg uppercase mb-3">
                Hunter Name
              </label>
              <input
                type="text"
                value={hunterName}
                onChange={(e) => setHunterName(e.target.value)}
                className="zen-input text-xl font-gaming"
                maxLength={20}
                placeholder="Enter your Hunter name"
              />
            </div>

            {/* Personality Selector (NEW) */}
            <div>
              <label className="block text-zen-cyan font-gaming text-lg uppercase mb-4">
                Choose Your Personality Type
              </label>

              <select
                className="zen-input font-gaming"
                value={selectedPersonality}
                onChange={(e) => setSelectedPersonality(e.target.value)}
              >
                <option value="general">General</option>
                <option value="masculine">Masculine</option>
                <option value="hustler">Hustler / Money-driven</option>
                <option value="fitness">Fitness Focused</option>
                <option value="student">Student</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="spiritual">Spiritual</option>
              </select>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-zen-cyan font-gaming text-lg uppercase mb-4">
                Choose Your Class
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {AVATARS.map((avatar) => (
                  <motion.button
                    key={avatar.type}
                    onClick={() => setSelectedAvatar(avatar.type)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedAvatar === avatar.type
                        ? 'border-zen-cyan bg-zen-cyan/20 zen-glow'
                        : 'border-zen-cyan/30 hover:border-zen-cyan/50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{avatar.icon}</div>
                    <div className="text-sm font-gaming uppercase text-zen-cyan">
                      {avatar.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-zen-cyan font-gaming text-lg uppercase mb-4">
                Choose Your Theme Color
              </label>
              <div className="grid grid-cols-5 gap-4">
                {THEMES.map((theme) => (
                  <motion.button
                    key={theme.color}
                    onClick={() => setSelectedTheme(theme.color)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg border-2 transition-all relative ${
                      selectedTheme === theme.color
                        ? 'border-zen-cyan zen-glow'
                        : 'border-zen-cyan/30 hover:border-zen-cyan/50'
                    }`}
                  >
                    <div className={`w-full h-16 rounded bg-gradient-to-br ${theme.class} mb-2`} />
                    <div className="text-sm font-gaming uppercase text-zen-cyan">
                      {theme.label}
                    </div>

                    {selectedTheme === theme.color && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Zap className="w-6 h-6 text-zen-cyan" fill="currentColor" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="zen-button w-full text-xl py-4"
            >
              Begin Your Quest
            </motion.button>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
