import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="zen-title text-3xl">Settings</h1>
          <p className="text-gray-400 font-gaming uppercase mt-1">Update your profile & preferences</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="zen-button px-4 py-2"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="zen-card p-6">
          <h2 className="font-gaming text-lg text-zen-cyan mb-2">Profile</h2>
          <p className="text-sm text-gray-400">Update display name, avatar, and other profile settings here.</p>
          {/* TODO: add form fields for updating profile */}
        </section>

        <section className="zen-card p-6">
          <h2 className="font-gaming text-lg text-zen-cyan mb-2">Preferences</h2>
          <p className="text-sm text-gray-400">Theme, notifications, privacy settings, etc.</p>
          {/* TODO: add toggles / inputs for preferences */}
        </section>

        <section className="zen-card p-6">
          <h2 className="font-gaming text-lg text-zen-cyan mb-2">Danger Zone</h2>
          <p className="text-sm text-gray-400">Account deletion or other destructive actions.</p>
          {/* TODO: destructive actions */}
        </section>
      </div>
    </div>
  );
}
