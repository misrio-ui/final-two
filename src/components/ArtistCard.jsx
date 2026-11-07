export default function ArtistCard({ artist, onOpen }) {
  return (
    <article className="song-card">
      <img className="round" src={artist.picture_medium || artist.picture_small} alt="" />
      <div className="song-info">
        <strong>{artist.name}</strong>
        <small>อันดับนักร้อง #{artist.position}</small>
      </div>
      <button className="view-button" onClick={() => onOpen(artist.id)}>ดูเพลง</button>
    </article>
  );
}
