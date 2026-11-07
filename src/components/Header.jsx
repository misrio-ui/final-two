import SearchBox from './SearchBox.jsx';
import FavoritesButton from './FavoritesButton.jsx';

export default function Header({
  view,
  query,
  favoritesCount,
  onQueryChange,
  onSearch,
  onSongs,
  onArtists,
  onAlbums,
  onSort,
  onFavorites,
}) {
  const placeholder = view === 'artists'
    ? 'ค้นหาชื่อนักร้อง...'
    : view === 'albums'
      ? 'ค้นหาชื่ออัลบั้ม...'
      : 'ค้นหาชื่อเพลง...';

  return (
    <header>
      <nav aria-label="ประเภทข้อมูล">
        <button className={view === 'songs' ? 'active' : ''} onClick={onSongs}>
          <i className="fa-solid fa-music" /> เพลง
        </button>
        <button className={view === 'artists' ? 'active' : ''} onClick={onArtists}>
          <i className="fa-solid fa-microphone" /> นักร้อง
        </button>
        <button className={view === 'albums' ? 'active' : ''} onClick={onAlbums}>
          <i className="fa-solid fa-layer-group" /> อัลบั้ม
        </button>
        <button className="sort-button" disabled={view !== 'songs'} onClick={onSort}>ยอดวิว</button>
      </nav>
      <div className="header-actions">
        <SearchBox
          value={query}
          placeholder={placeholder}
          ariaLabel={view === 'artists' ? 'ค้นหานักร้อง' : view === 'albums' ? 'ค้นหาอัลบั้ม' : 'ค้นหาเพลง'}
          onChange={onQueryChange}
          onSearch={onSearch}
        />
        <FavoritesButton
          active={view === 'favorites'}
          count={favoritesCount}
          onClick={onFavorites}
        />
      </div>
    </header>
  );
}
