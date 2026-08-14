import { useEffect, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";

export default function InstallApp() {
  const [installEvent, setInstallEvent] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone;
    setInstalled(Boolean(standalone));

    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
      setShowHelp(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (installed) return null;

  const handleInstall = async () => {
    if (installEvent) {
      installEvent.prompt();
      await installEvent.userChoice;
      setInstallEvent(null);
      return;
    }
    setShowHelp(true);
  };

  return (
    <>
      <button className="install-app-button" type="button" onClick={handleInstall} title="Install CanBook">
        {installEvent ? <Download size={15} /> : <Smartphone size={15} />}
        <span>install app</span>
      </button>

      {showHelp && (
        <div className="install-help-backdrop" role="presentation" onClick={() => setShowHelp(false)}>
          <section className="install-help-card" role="dialog" aria-modal="true" aria-labelledby="install-help-title" onClick={(event) => event.stopPropagation()}>
            <button className="install-help-close" type="button" onClick={() => setShowHelp(false)} aria-label="Close"><X size={18} /></button>
            <div className="install-help-icon"><Smartphone size={24} /></div>
            <p className="pixel-label">take canbook with you</p>
            <h2 id="install-help-title">Add CanBook to your home screen.</h2>
            <p className="install-help-copy">
              On iPhone or iPad, tap <strong>Share</strong> in Safari, then choose <strong>Add to Home Screen</strong>.
              On Android, use your browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.
            </p>
            <button className="pixel-button install-help-done" type="button" onClick={() => setShowHelp(false)}>got it →</button>
          </section>
        </div>
      )}
    </>
  );
}
