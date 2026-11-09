import Status from './Status.jsx';
import SongCard from './SongCard.jsx';
import AlbumCard from './AlbumCard.jsx';
import ArtistCard from './ArtistCard.jsx';

export default function ContentPanel({
  view, label, status, error, sortStatus, songs, albums, artists,
  artistDetail, currentSong, playing, onSelectSong, onOpenAlbum, onOpenArtist,
  onSongs, onArtists, onAlbums, onSort,
}) {
  const count = view === 'songs' || view === 'favorites'
    ? songs.length
    : view === 'artist-detail' || view === 'artist-songs' || view === 'album-detail' || view === 'album-songs' ? songs.length
    : view === 'artist-albums' ? albums.length
    : view === 'albums' ? albums.length : artists.length;

  return (
    <section className="list-panel" aria-label="รายการ">
      <div className="panel-heading">
        <div className="panel-actions" aria-label="ประเภทข้อมูล">
          <button className={view === 'songs' ? 'active' : ''} type="button" onClick={onSongs}>
            <i className="fa-solid fa-music" /> เพลง
          </button>
          <button className={view === 'artists' ? 'active' : ''} type="button" onClick={onArtists}>
            <i className="fa-solid fa-microphone" /> นักร้อง
          </button>
          <button className={view === 'albums' ? 'active' : ''} type="button" onClick={onAlbums}>
            <i className="fa-solid fa-layer-group" /> อัลบั้ม
          </button>
          <button className="sort-button" type="button" disabled={view !== 'songs'} onClick={onSort}>
            ยอดวิว
          </button>
        </div>
        {(view === 'songs' || view === 'favorites') && sortStatus && (
          <span className="sort-status">{sortStatus}</span>
        )}
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

      {!status.includes('loading') && status !== 'error' && status !== 'empty' && (view === 'albums' || view === 'artist-albums') && (
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

      {!status.includes('loading') && status !== 'error' && status !== 'empty' && (view === 'artist-detail' || view === 'artist-songs' || view === 'album-detail' || view === 'album-songs') && (
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

      {status === 'empty' && (
        <div className="status empty">
          <i className="fa-solid fa-magnifying-glass" /> ไม่พบข้อมูลที่ค้นหา
        </div>
      )}
    </section>
  );
}
