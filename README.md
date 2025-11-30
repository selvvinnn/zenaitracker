# ZEN Habit Tracker - Solo Leveling Style

A gamified habit tracking web application inspired by Solo Leveling's quest system. Level up your custom character by completing daily tasks with an immersive RPG-style interface.

![ZEN Habit Tracker](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.38-green)

## 🎮 Features

### Core Features
- **Authentication System** - Secure login/signup with Supabase
- **Character Customization** - Choose avatar, name, and theme
- **Daily Quest Interface** - Track tasks with progress bars and real-time updates
- **Monthly Calendar View** - Visual calendar with completion status
- **Yearly Overview** - Long-term progress tracking
- **Gamification** - XP system, levels, ranks (E to SSS)
- **Analytics Dashboard** - Charts and visualizations of your progress
- **Notes System** - Daily journaling with mood tracking

### Design
- Dark fantasy RPG aesthetics
- Glowing cyan borders and effects
- Smooth animations with Framer Motion
- Responsive design (mobile, tablet, desktop)
- Particle effects and visual feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Zen_Habit_Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the SQL schema provided in `supabase-schema.sql`

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:5173`

## 📊 Database Schema

The application uses Supabase (PostgreSQL) with the following tables:

- `users` - User accounts and character data
- `tasks` - Individual tasks/quests
- `daily_entries` - Daily entries with notes and completion data

See `supabase-schema.sql` for the complete schema.

## 🎯 Usage

1. **Sign Up** - Create your account
2. **Create Character** - Choose your Hunter name, class, and theme
3. **Add Quests** - Create daily tasks with goals
4. **Track Progress** - Update task progress throughout the day
5. **Level Up** - Earn XP and unlock new ranks
6. **View Analytics** - Check your monthly and yearly progress

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **State Management**: Zustand

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── store/           # Zustand state management
├── lib/             # Utility functions and Supabase client
├── types/           # TypeScript type definitions
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## 🎨 Customization

### Themes
The app supports 5 color themes:
- Azure (Blue)
- Violet (Purple)
- Crimson (Red)
- Golden (Gold)
- Emerald (Green)

### Avatars
Choose from 6 character classes:
- Warrior ⚔️
- Mage 🔮
- Assassin 🗡️
- Archer 🏹
- Knight 🛡️
- Berserker ⚡

## 🔮 Future Features

- [ ] Weekly and special event quests
- [ ] Social sharing of achievements
- [ ] Sound effects toggle
- [ ] Export data (PDF/CSV)
- [ ] PWA support for offline use
- [ ] Mobile app versions
- [ ] Achievement badges
- [ ] Leaderboards (optional)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for Habit Trackers and Solo Leveling Fans**

