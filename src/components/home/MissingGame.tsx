// The uploaded archive did not include the game engine folder (src/game/*),
// so the original Minion Run / Fortress / Black Hole games show this notice.
export default function MissingGame(props: { onBack?: () => void; onComplete?: () => void; [k: string]: unknown }) {
  const back = props.onBack ?? props.onComplete;
  return (
    <div className="rounded-[24px] p-8 text-center" style={{ background: "rgba(255,255,255,0.8)", border: "2px solid rgba(29,99,210,0.12)" }}>
      <h3 className="text-[#123e9b] text-2xl font-extrabold mb-2">This game is missing a few files</h3>
      <p className="text-gray-700/80 mb-4">The upload didn't include this game's engine files, so it can't run yet.</p>
      {back && (
        <button onClick={back} className="px-5 py-3 rounded-full font-extrabold text-[#123e9b]" style={{ background: "linear-gradient(135deg, #f9d93d, #f6bf2d)" }}>
          Back
        </button>
      )}
    </div>
  );
}
