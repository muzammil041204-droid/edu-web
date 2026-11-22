import { useState } from 'react';
import { Link } from 'react-router';
import { Button, Logo } from '../../components/ui.jsx';
import { isDemo, signIn } from '../../lib/api.js';

export default function Login({ onSignedIn }) {
  const [email, setEmail] = useState(isDemo ? 'counsellor@arivuadmissions.in' : '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      onSignedIn(await signIn(email, password));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-forest-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
        </div>
        <form onSubmit={handleSubmit} noValidate className="card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <h1 className="text-2xl font-bold">Staff sign-in</h1>
          <p className="mt-1 text-muted">Leads, colleges and fees.</p>
          {isDemo ? (
            <p className="mt-4 rounded-xl bg-gold-soft px-4 py-3 text-sm text-[#5b4a2c]">
              Demo mode: use any email with the password <strong>demo1234</strong>.
            </p>
          ) : null}
          <div className="mt-6 grid gap-4">
            <div>
              <label htmlFor="admin-email" className="field-label">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                className="field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="field-label">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                className="field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? 'admin-error' : undefined}
              />
            </div>
            {error ? (
              <p
                id="admin-error"
                role="alert"
                className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger"
              >
                {error}
              </p>
            ) : null}
            <Button type="submit" loading={busy} icon={false} className="w-full">
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-forest-700 hover:underline">
            ← Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
