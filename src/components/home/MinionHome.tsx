import { lazy, Suspense, useState, useCallback } from 'react';
import { Sparkles, ShieldCheck, Zap, Rocket, Users } from 'lucide-react';
import PasswordPrompt from '@/components/PasswordPrompt';
import { Link } from '@tanstack/react-router';

// The 3D game and the cinematic pull in three.js - about 700 kB. Loading them
// on demand keeps the landing page light and instant.
const Game3D = lazy(() => import('@/components/home/MissingGame'));
const BlackHoleCinematic = lazy(() => import('@/components/home/MissingGame'));
// The fortress mini-game carries its own stylesheet and animation set, so it is
// kept out of the landing page bundle until it scrolls into view.
const FortressGame = lazy(() => import('@/components/home/MissingGame'));
import angelinaPhoto from '@/assets/angelina.webp';
import pillarPhoto from '@/assets/pillar.jpeg';
import anamaeriaPhoto from '@/assets/anamaeria.jpeg';
import kingBobPhoto from '@/assets/king_bob.jpeg';

// Gallery photos - one picture per minion, and the name is shown on the photo
// so it is obvious which picture belongs to whom.
const minionPhotos = [
  { name: 'Angelina', url: angelinaPhoto },
  { name: 'Pillar', url: pillarPhoto },
  { name: 'Anamaeria', url: anamaeriaPhoto },
  { name: 'King Bob', url: kingBobPhoto },
];

const features = [
  { icon: Zap, title: 'Playful Energy', text: 'Every detail is designed to feel bright, energetic, and full of personality.' },
  { icon: Rocket, title: 'Big Ideas', text: 'We turn bold concepts into exciting experiences people can instantly connect with.' },
  { icon: Users, title: 'Team Spirit', text: 'Collaboration, humor, and creativity are at the heart of everything we build.' },
];

function LoadingScreen({ label }: { label: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #fff8d8 0%, #f0f7ff 100%)' }}
    >
      <div className="text-center">
        <div
          className="mx-auto mb-4 rounded-full"
          style={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #f9d93d, #f6bf2d)',
            animation: 'minionSpin 1.1s linear infinite',
          }}
        />
        <p className="font-extrabold text-[#123e9b] tracking-[0.2em] uppercase text-sm">{label}</p>
        <style>{'@keyframes minionSpin { to { transform: rotate(360deg) } }'}</style>
      </div>
    </div>
  );
}

type AppView = 'home' | 'game' | 'enhancedGame';
/** Which secret the password prompt is currently guarding. */
type Gate = 'blackhole' | 'invincible' | null;

function readInvincible(): boolean {
  try {
    return localStorage.getItem('minionRunInvincible') === '1';
  } catch {
    return false;
  }
}

function App() {
  const [view, setView] = useState<AppView>('home');
  const [gate, setGate] = useState<Gate>(null);
  const [showCinematic, setShowCinematic] = useState(false);
  const [invincible, setInvincible] = useState(readInvincible);

  const handleSecretClick = useCallback(() => {
    setGate('blackhole');
  }, []);

  // Off -> ask for the password. On -> turning it back off needs no password.
  const handleInvincibleClick = useCallback(() => {
    if (invincible) {
      setInvincible(false);
      try { localStorage.setItem('minionRunInvincible', '0'); } catch { /* ignore */ }
    } else {
      setGate('invincible');
    }
  }, [invincible]);

  const handlePasswordSuccess = useCallback(() => {
    if (gate === 'invincible') {
      setInvincible(true);
      try { localStorage.setItem('minionRunInvincible', '1'); } catch { /* ignore */ }
      setGate(null);
      return;
    }
    setGate(null);
    setShowCinematic(true);
  }, [gate]);

  const handleCinematicComplete = useCallback(() => {
    setShowCinematic(false);
    setView('enhancedGame');
  }, []);

  const handlePasswordCancel = useCallback(() => {
    setGate(null);
  }, []);

  if (showCinematic) {
    return (
      <Suspense fallback={<LoadingScreen label="Opening the black hole..." />}>
        <BlackHoleCinematic onComplete={handleCinematicComplete} />
      </Suspense>
    );
  }

  if (view === 'game' || view === 'enhancedGame') {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fff8d8 0%, #f0f7ff 100%)' }}>
        <div className="max-w-[1200px] mx-auto p-5 sm:p-6">
          <Suspense fallback={<LoadingScreen label="Loading Minion Run 3D..." />}>
            <Game3D
              onBack={() => setView('home')}
              enhanced={view === 'enhancedGame'}
              invincible={invincible}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fff8d8 0%, #f0f7ff 100%)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 pt-6 pb-10">
        {/* Top bar */}
        <header
          className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] px-5 sm:px-6 py-4"
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: '3px solid rgba(29,99,210,0.1)',
            boxShadow: '0 12px 30px rgba(19,32,66,0.18)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-3 font-bold text-[#123e9b]" style={{ fontFamily: '"Baloo 2", cursive', fontSize: 'clamp(1.3rem, 2vw, 2rem)' }}>
            <span
              className="inline-flex items-center justify-center rounded-full text-[#123e9b]"
              style={{
                width: 42, height: 42,
                background: 'linear-gradient(135deg, #f9d93d, #f6bf2d)',
                boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.08)',
              }}
            >
              M
            </span>
            <span>The Minions Project</span>
          </div>
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6 font-bold text-[#123e9b]">
            <Link to="/live" className="px-4 py-2 rounded-full font-extrabold text-[#123e9b]" style={{ background: 'linear-gradient(135deg, #f9d93d, #f6bf2d)' }}>Live Events</Link>
            <Link to="/admin" className="px-4 py-2 rounded-full font-extrabold text-white" style={{ background: '#123e9b' }}>Admin</Link>
            <a href="#about" className="hover:underline">About</a>
            <a href="#features" className="hover:underline">Features</a>
            <button onClick={() => setView('game')} className="hover:underline">3D Game</button>
            <a href="#fortress" className="hover:underline">Fortress</a>
            <a href="#gallery" className="hover:underline">Gallery</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
        </header>

        <main>
          {/* Black hole gate - always the first thing you can click */}
          <section
            className="mt-6 rounded-[26px] p-6 sm:p-7 flex flex-wrap items-center justify-between gap-5"
            style={{
              background: 'radial-gradient(circle at 20% 30%, #241056 0%, #05010f 60%, #000000 100%)',
              border: '2px solid rgba(139,92,246,0.35)',
              boxShadow: '0 18px 45px rgba(76,29,149,0.4)',
            }}
          >
            <div className="max-w-[620px]">
              <p className="uppercase font-extrabold text-[#c4b5fd] mb-2" style={{ letterSpacing: '0.16em', fontSize: '0.72rem' }}>
                Bonus gate, password protected
              </p>
              <h2 className="text-white leading-tight mb-2" style={{ fontFamily: '"Baloo 2", cursive', fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)' }}>
                The Black Hole Button
              </h2>
              <p className="text-white/70 leading-relaxed">
                It does not open the normal run. It asks for a password, throws the minions into a black hole while they
                scream, flashes the whole screen white - and then drops you into the ultra-realistic Minion Run.
              </p>
            </div>
            <button
              onClick={handleSecretClick}
              className="group flex items-center gap-3 px-7 py-4 rounded-full font-extrabold text-white transition-transform hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #f9d93d 140%)',
                boxShadow: '0 16px 40px rgba(124,58,237,0.5)',
              }}
            >
              <span
                className="inline-flex items-center justify-center rounded-full transition-transform group-hover:rotate-180"
                style={{ width: 30, height: 30, background: '#000', boxShadow: '0 0 0 3px rgba(249,217,61,0.7)' }}
                aria-hidden
              />
              <Sparkles className="w-4 h-4" />
              Enter the Black Hole
            </button>
          </section>

          {/* Hero */}
          <section className="grid lg:grid-cols-[1.2fr_0.8fr] items-center gap-10 py-12">
            <div>
              <p
                className="uppercase font-extrabold text-[#1d63d2] mb-3"
                style={{ letterSpacing: '0.12em', fontSize: '0.77rem' }}
              >
                Banana-powered creativity
              </p>
              <h1
                className="text-[#123e9b] leading-none"
                style={{ fontFamily: '"Baloo 2", cursive', fontSize: 'clamp(3rem, 5vw, 5rem)', letterSpacing: '-0.05em' }}
              >
                Build something fun, bold, and unforgettable.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-700/80 max-w-[620px]">
                The Minions Project brings together playful energy, smart ideas, and a whole lot of
                enthusiasm for making cool experiences that people love.
              </p>
              <div className="flex flex-wrap gap-4 mt-7">
                <button
                  onClick={() => setView('game')}
                  className="px-5 py-3.5 rounded-full font-extrabold text-[#123e9b] transition-transform hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #f9d93d, #f6bf2d)',
                    boxShadow: '0 14px 30px rgba(246,191,45,0.35)',
                  }}
                >
                  Play 3D Run
                </button>
                <a
                  href="#contact"
                  className="px-5 py-3.5 rounded-full font-extrabold text-[#123e9b] transition-transform hover:-translate-y-0.5"
                  style={{ background: 'rgba(29,99,210,0.08)' }}
                >
                  Join the fun
                </a>
                <button
                  onClick={handleInvincibleClick}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-full font-extrabold transition-transform hover:-translate-y-0.5"
                  style={{
                    background: invincible
                      ? 'linear-gradient(135deg, #a5f3fc, #38bdf8)'
                      : 'rgba(29,99,210,0.08)',
                    color: '#0b3a63',
                    boxShadow: invincible ? '0 14px 30px rgba(56,189,248,0.45)' : 'none',
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {invincible ? 'Invincible: ON' : 'Invincible'}
                </button>
              </div>
            </div>

            {/* Profile card */}
            <div
              className="rounded-[30px] p-4.5"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,248,214,0.9))',
                border: '3px solid rgba(29,99,210,0.12)',
                boxShadow: '0 18px 40px rgba(18,62,155,0.12)',
              }}
            >
              <div
                className="rounded-[22px] overflow-hidden min-h-[360px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #d6ebff, #fef4c7)' }}
              >
                <img
                  src={kingBobPhoto}
                  alt="King Bob"
                  className="w-full h-full object-cover min-h-[360px]"
                />
              </div>
              <div className="px-2.5 pt-4 pb-2">
                <p className="text-xs uppercase font-extrabold text-[#1d63d2] mb-1.5" style={{ letterSpacing: '0.12em' }}>Profile</p>
                <h2 className="text-[#1d2333] leading-none mb-2" style={{ fontFamily: '"Baloo 2", cursive', fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
                  King Bob
                </h2>
                <p className="text-gray-700/80 leading-relaxed">Creative leader - Minion enthusiast - Team banana booster</p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="grid sm:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-[24px] p-6 sm:p-7"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '2px solid rgba(29,99,210,0.08)',
                  boxShadow: '0 10px 25px rgba(29,35,51,0.06)',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-2xl mb-3.5 text-3xl"
                  style={{
                    width: 56, height: 56,
                    background: 'linear-gradient(135deg, #fff0a8, #f5cf3c)',
                  }}
                >
                  <Icon size={30} strokeWidth={2.2} color="#123e9b" />
                </div>
                <h3 className="text-[#123e9b] mb-2" style={{ fontFamily: '"Baloo 2", cursive', fontSize: '1.8rem' }}>
                  {title}
                </h3>
                <p className="leading-relaxed text-gray-700/75">{text}</p>
              </article>
            ))}
          </section>

          {/* Game preview teaser */}
          <section className="mt-10 rounded-[28px] p-6 sm:p-8 text-center" style={{
            background: 'linear-gradient(135deg, rgba(29,99,210,0.08), rgba(249,217,61,0.17))',
            border: '2px solid rgba(29,99,210,0.08)',
          }}>
            <h2 className="text-[#123e9b] mb-3" style={{ fontFamily: '"Baloo 2", cursive', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Minion Run 3D
            </h2>
            <p className="text-gray-700/80 max-w-xl mx-auto mb-5 leading-relaxed">
              Run through 8 hand-built worlds: a living ocean floor with whales and jellyfish, forests full of trees
              and flowers, tropical beaches, a neon night city, golden deserts, a lava world, the arctic, and deep space.
              The road curves to follow you, obstacles glow so you always see them, and a black hole warps you onward.
            </p>
            <button
              onClick={() => setView('game')}
              className="px-6 py-3.5 rounded-full font-extrabold text-[#123e9b] transition-transform hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #f9d93d, #f6bf2d)',
                boxShadow: '0 14px 30px rgba(246,191,45,0.35)',
              }}
            >
              Play Now
            </button>
          </section>

          {/* Vector's Fortress Infiltration: five weapons, one heist */}
          <Suspense
            fallback={
              <div className="mt-10 rounded-[28px] p-6 text-center font-bold text-[#123e9b]" style={{ background: 'rgba(255,255,255,0.7)' }}>
                Loading Vector&apos;s Fortress...
              </div>
            }
          >
            <FortressGame />
          </Suspense>

          {/* Gallery */}
          <section id="gallery" className="mt-10 rounded-[28px] p-7" style={{
            background: 'linear-gradient(135deg, rgba(29,99,210,0.08), rgba(249,217,61,0.17))',
            border: '2px solid rgba(29,99,210,0.08)',
          }}>
            <h2 className="text-[#123e9b] mb-5" style={{ fontFamily: '"Baloo 2", cursive', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Meet the Minions
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {minionPhotos.map((m) => (
                <article
                  key={m.name}
                  className="rounded-[24px] p-4 text-center"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    border: '2px solid rgba(29,99,210,0.08)',
                    boxShadow: '0 10px 25px rgba(29,35,51,0.06)',
                  }}
                >
                  <div
                    className="relative rounded-[18px] overflow-hidden aspect-square flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #d6ebff, #fef4c7)' }}
                  >
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                    {/* Name printed on the photo so the mapping is unmistakable */}
                    <span
                      className="absolute bottom-0 left-0 right-0 py-2 text-white font-extrabold uppercase"
                      style={{
                        fontFamily: '"Baloo 2", cursive',
                        fontSize: '1rem',
                        letterSpacing: '0.08em',
                        background: 'linear-gradient(180deg, rgba(18,62,155,0), rgba(18,62,155,0.85))',
                      }}
                    >
                      {m.name}
                    </span>
                  </div>
                  <h3 className="text-[#123e9b] mt-3" style={{ fontFamily: '"Baloo 2", cursive', fontSize: '1.45rem' }}>
                    {m.name}
                  </h3>
                </article>
              ))}
            </div>
          </section>

          {/* About */}
          <section id="about" className="mt-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-7 rounded-[28px] p-8" style={{
            background: 'linear-gradient(135deg, rgba(29,99,210,0.08), rgba(249,217,61,0.16))',
            border: '2px solid rgba(29,99,210,0.08)',
          }}>
            <div>
              <p className="uppercase font-extrabold text-[#1d63d2] mb-3" style={{ letterSpacing: '0.12em', fontSize: '0.77rem' }}>
                About the project
              </p>
              <h2 className="text-[#123e9b]" style={{ fontFamily: '"Baloo 2", cursive', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Mini moments, maximum fun.
              </h2>
            </div>
            <p className="leading-relaxed text-gray-700/80 text-lg">
              The Minions Project is a cheerful concept website built around a bold visual identity,
              friendly characters, and a simple mission: create joy through design, energy, and teamwork.
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer id="contact" className="flex flex-wrap justify-between gap-4 mt-9 pt-3.5 border-t-2 border-[#1d63d2]/10 font-semibold text-gray-700/75">
          <p>Contact: hello@minionsproject.dev</p>
          <p>&copy; {new Date().getFullYear()} The Minions Project</p>
        </footer>
      </div>

      {gate && (
        <PasswordPrompt
          onSuccess={handlePasswordSuccess}
          onCancel={handlePasswordCancel}
          title={gate === 'invincible' ? 'Invincible Mode' : undefined}
          description={
            gate === 'invincible'
              ? 'Enter the password to become unkillable. Once you get it right you can never die in Minion Run.'
              : undefined
          }
          submitLabel={gate === 'invincible' ? 'Activate' : undefined}
        />
      )}
    </div>
  );
}

export default App;
