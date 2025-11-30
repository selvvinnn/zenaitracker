import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import CharacterCreationPage from '@/pages/CharacterCreationPage';
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingScreen from '@/components/LoadingScreen';
import { AlertTriangle } from 'lucide-react';
import SettingsPage from '@/pages/SettingsPage';

function App() {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl && 
    !supabaseUrl.includes('placeholder') && 
    supabaseUrl !== 'your-supabase-url' &&
    supabaseUrl !== '' &&
    supabaseKey !== '' &&
    supabaseKey !== 'your-supabase-anon-key';
  
  // Check for secret key usage
  const isSecretKey = supabaseKey.length > 200 || supabaseKey.includes('service_role');

  if (!initialized) {
    return <LoadingScreen />;
  }

  // Show error if secret key is detected
  if (isSecretKey && isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zen-dark-primary p-4">
        <div className="zen-card p-8 max-w-2xl w-full border-zen-red/50">
          <div className="flex items-center gap-4 mb-6">
            <AlertTriangle className="w-12 h-12 text-zen-red flex-shrink-0" />
            <div>
              <h1 className="zen-title text-3xl mb-2 text-zen-red">Security Error</h1>
              <p className="text-gray-400 font-gaming uppercase">Wrong API Key Type</p>
            </div>
          </div>
          
          <div className="space-y-4 text-gray-300 mb-6">
            <p className="text-zen-red font-bold">⚠️ CRITICAL: You're using the SECRET/SERVICE_ROLE key!</p>
            <p>This is <strong>dangerous</strong> and forbidden in browsers. The service_role key bypasses all security.</p>
            
            <div className="bg-zen-dark-primary p-4 rounded border border-zen-red/30">
              <p className="font-bold mb-2">To fix this:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Go to <strong>Supabase Dashboard → Settings → API</strong></li>
                <li>Under <strong>"Project API keys"</strong>, find the <strong className="text-zen-green">"anon public"</strong> key</li>
                <li>Copy the <strong>anon public</strong> key (NOT the service_role secret key)</li>
                <li>Update your <code className="bg-zen-dark-primary px-2 py-1 rounded text-zen-cyan">.env</code> file:</li>
              </ol>
              <div className="mt-3 bg-black/50 p-3 rounded font-mono text-sm">
                <div className="text-zen-cyan">VITE_SUPABASE_URL=your-project-url</div>
                <div className="text-zen-green">VITE_SUPABASE_ANON_KEY=anon-public-key-here</div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                ✅ Use <strong>anon public</strong> key (shorter, ~200-300 chars) <br/>
                ❌ NEVER use <strong>service_role</strong> key (longer, ~300+ chars)
              </p>
            </div>
            
            <div className="bg-zen-gold/10 border border-zen-gold/30 p-4 rounded">
              <p className="text-sm">
                <strong>Security Note:</strong> If you've committed the service_role key to Git, 
                immediately regenerate it in Supabase Dashboard to revoke the old key.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="zen-button w-full"
          >
            Reload After Fixing
          </button>
        </div>
      </div>
    );
  }

  // Show configuration message if Supabase is not set up
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zen-dark-primary p-4">
        <div className="zen-card p-8 max-w-2xl w-full">
          <div className="flex items-center gap-4 mb-6">
            <AlertTriangle className="w-12 h-12 text-zen-gold flex-shrink-0" />
            <div>
              <h1 className="zen-title text-3xl mb-2">Configuration Required</h1>
              <p className="text-gray-400 font-gaming uppercase">Setup Supabase to continue</p>
            </div>
          </div>
          
          <div className="space-y-4 text-gray-300 mb-6">
            <p>To run this application, you need to configure Supabase:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Create a <code className="bg-zen-dark-primary px-2 py-1 rounded text-zen-cyan">.env</code> file in the project root</li>
              <li>Add your Supabase credentials:</li>
            </ol>
            <div className="bg-zen-dark-primary p-4 rounded border border-zen-cyan/30 font-mono text-sm">
              <div>VITE_SUPABASE_URL=your-project-url</div>
              <div>VITE_SUPABASE_ANON_KEY=your-anon-key</div>
            </div>
            <p className="text-sm text-gray-400">
              Get your credentials from Supabase Dashboard → Settings → API
            </p>
            <p className="text-sm text-gray-400">
              Then run the SQL schema from <code className="bg-zen-dark-primary px-2 py-1 rounded text-zen-cyan">supabase-schema.sql</code> in your Supabase SQL Editor
            </p>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="zen-button w-full"
          >
            Reload After Configuration
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1f2e',
            color: '#fff',
            border: '1px solid #00d4ff',
          },
          success: {
            iconTheme: {
              primary: '#00ff88',
              secondary: '#1a1f2e',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4444',
              secondary: '#1a1f2e',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/character"
          element={
            <ProtectedRoute>
              <CharacterCreationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

