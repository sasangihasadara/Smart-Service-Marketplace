import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services";
const GOOGLE_SCRIPT_URL = "https://accounts.google.com/gsi/client";

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function GoogleSignInButton({ onCredential, disabled = false }) {
  const containerRef = useRef(null);
  const [error, setError] = useState("");
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !containerRef.current) return undefined;

    let mounted = true;

    loadGoogleScript()
      .then(() => {
        if (!mounted || !window.google?.accounts?.id || !containerRef.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) onCredential?.(response.credential);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
          width: 360,
          locale: "en",
        });
      })
      .catch(() => {
        if (mounted) setError("Google sign-in could not be loaded. Please try again.");
      });

    return () => { mounted = false; };
  }, [clientId, onCredential]);

  if (!clientId) {
    return (
      <div className="google-signin-unavailable">
        <button type="button" disabled className="google-fallback-button">G&nbsp;&nbsp; Continue with Google</button>
        <p>Google sign-in is being configured for this environment.</p>
      </div>
    );
  }

  return (
    <div className={`google-signin-wrap${disabled ? " is-disabled" : ""}`}>
      <div ref={containerRef} className="google-signin-button" />
      {error ? <p className="google-signin-error">{error}</p> : null}
    </div>
  );
}
