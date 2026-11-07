export default function SongCard({ song, selected, playing, onSelect }) {
  const rank = song.rank >= 1000000
    ? `${(song.rank / 1000000).toFixed(1)}M`
    : song.rank >= 1000
      ? `${Math.round(song.rank / 1000)}K`
      : String(song.rank || 0);

  return (
    <article className={`song-card ${selected ? 'selected' : ''}`}>
      <img src={song.album.cover_small || song.artist.picture_small} alt="" />
      <div className="song-info">
        <strong>{song.title}</strong>
        <span>{song.artist.name}</span>
        <small>{song.album.title}</small>
      </div>
      <div className="song-actions">
        <span>{rank}</span>
        <button onClick={() => onSelect(song.id, true)}>
          {selected && playing ? 'กำลังฟัง' : 'กดฟัง'}
        </button>
      </div>
    </article>
  );
}
