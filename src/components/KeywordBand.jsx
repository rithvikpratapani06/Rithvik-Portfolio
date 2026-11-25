/* Big tilted strip of keywords that glides sideways (pure CSS = smooth). */
export default function KeywordBand({ words, reverse = false }) {
  const line = [...words, ...words, ...words, ...words];
  return (
    <div aria-hidden className="band-wrap my-16 sm:my-24">
      <div className={`band ${reverse ? "band-reverse" : ""}`}>
        {line.map((w, i) => (
          <span key={i} className={(i % words.length) % 2 ? "band-outline" : ""}>
            {w}
            <span className="band-star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}