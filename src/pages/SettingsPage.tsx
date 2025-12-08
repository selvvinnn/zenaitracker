import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto mt-6 px-3 sm:px-0 space-y-6 w-full overflow-x-hidden">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ml-3">
        <div>
          <h1 className="zen-title text-2xl sm:text-3xl">Settings</h1>
          <p className="text-gray-400 font-gaming uppercase mt-1">
            Update your profile & preferences
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="zen-button px-4 py-2 text-sm"
        >
          Back
        </button>
      </div>

      {/* Sections */}
      <section className="zen-card p-4 sm:p-6">
        <h2 className="font-gaming text-lg text-zen-cyan mb-2">Profile</h2>
        <p className="text-sm text-gray-400">
          Update display name, avatar, and other profile settings here.
        </p>
      </section>

      <section className="zen-card p-4 sm:p-6">
        <h2 className="font-gaming text-lg text-zen-cyan mb-2">Preferences</h2>
        <p className="text-sm text-gray-400">
          Theme, notifications, privacy settings, etc.
        </p>
      </section>

      <section className="zen-card p-4 sm:p-6">
        <h2 className="font-gaming text-lg text-zen-cyan mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-400">
          Account deletion or other destructive actions.
        </p>
      </section>

    </div>
  );
}
