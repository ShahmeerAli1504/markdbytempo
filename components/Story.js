export default function Story({ text }) {
  if (!text) return null;
  return (
    <div className="story">
      {text.split(/\n{2,}/).map((block, i) => {
        const lines = block.split('\n');
        if (lines[0] === lines[0].toUpperCase() && lines[0].length < 40 && /[A-Z]/.test(lines[0]) && lines.length > 1) {
          return (
            <div key={i}>
              <h3 className="story-head">{lines[0]}</h3>
              <p>{lines.slice(1).join(' ')}</p>
            </div>
          );
        }
        return <p key={i}>{lines.join(' ')}</p>;
      })}
    </div>
  );
}
