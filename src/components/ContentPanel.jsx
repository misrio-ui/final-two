import Status from './Status.jsx';
import SongCard from './SongCard.jsx';
import AlbumCard from './AlbumCard.jsx';
import ArtistCard from './ArtistCard.jsx';

export default function ContentPanel({
  view, label, status, error, sortStatus, songs, albums, artists,
  currentSong, playing, onSelectSong, onOpenAlbum, onOpenArtist,
}) {
  const count = view === 'songs' || view === 'favorites'
    ? songs.length
    : view === 'albums' ? albums.length : artists.length;

  return (
    <section className="list-panel" aria-label="รายการ">
      <div className="panel-heading">
        <div>
          <span className="label">{label}</span>
          <span className="count">({count} รายการ)</span>
        </div>
        <span className="sort-status">
          {(view === 'songs' || view === 'favorites') && sortStatus ? sortStatus : ''}
        </span>
      </div>
      <Status state={status} error={error} />

      {!status.includes('loading') && status !== 'error' && status !== 'empty' && (view === 'songs' || view === 'favorites') && (
        <div className="cards">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              selected={currentSong?.id === song.id}
              playing={playing}
              onSelect={onSelectSong}
            />
          ))}
        </div>
      )}

      {!status.includes('loading') && status !== 'error' && status !== 'empty' && view === 'albums' && (
        <div className="cards">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} onOpen={onOpenAlbum} />
          ))}
        </div>
      )}

      {!status.includes('loading') && status !== 'error' && status !== 'empty' && view === 'artists' && (
        <div className="cards">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} onOpen={onOpenArtist} />
          ))}
        </div>
      )}

      {status === 'empty' && (
        <div className="status empty">
          <i className="fa-solid fa-magnifying-glass" /> ไม่พบข้อมูลที่ค้นหา
        </div>
      )}
    </section>
  );
}
