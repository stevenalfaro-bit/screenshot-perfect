import { useState, useRef } from 'react';
import { Lock } from 'lucide-react';
import { isSecretPassword } from '@/game/secret';

interface PasswordPromptProps {
  onSuccess: () => void;
  onCancel: () => void;
  /** Optional copy so the same prompt can guard different secrets. */
  title?: string | undefined;
  description?: string | undefined;
  submitLabel?: string | undefined;
}

export default function PasswordPrompt({
  onSuccess,
  onCancel,
  title = 'Enter Secret Code',
  description = "You've found a hidden passage. Enter the password to unlock something extraordinary.",
  submitLabel = 'Unlock',
}: PasswordPromptProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSecretPassword(password)) {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{ background: 'rgba(11,16,32,0.92)' }}>
      <div
        className="rounded-[24px] px-8 py-7 text-center max-w-sm shadow-2xl"
        style={{ background: 'rgba(255,255,255,0.95)' }}
      >
        <div
          className="flex items-center justify-center rounded-full mx-auto mb-4"
          style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #1d63d2, #123e9b)',
          }}
        >
          <Lock className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-[#123e9b] mb-2" style={{ fontFamily: '"Baloo 2", cursive' }}>
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Password..."
            autoFocus
            className="w-full px-4 py-3 rounded-full border-2 text-center font-bold text-[#123e9b] mb-3 outline-none transition-colors"
            style={{
              borderColor: error ? '#ef4444' : 'rgba(29,99,210,0.15)',
              background: 'rgba(29,99,210,0.04)',
            }}
          />
          {error && (
            <p className="text-red-500 text-sm font-bold mb-3">Wrong password. Try again.</p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              type="submit"
              className="px-6 py-3 rounded-full font-bold text-[#123e9b] transition-transform hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #f9d93d, #f6bf2d)',
                boxShadow: '0 14px 30px rgba(246,191,45,0.35)',
              }}
            >
              {submitLabel}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-full font-bold text-[#123e9b] transition-colors hover:bg-[#1d63d2]/10"
              style={{ background: 'rgba(29,99,210,0.06)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
