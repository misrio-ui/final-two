import SearchBox from './SearchBox.jsx';
import FavoritesButton from './FavoritesButton.jsx';

export default function Header({
  view,
  query,
  favoritesCount,
  label,
  itemCount,
  onQueryChange,
  onSearch,
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
        <button className="nav-arrow" type="button" aria-label="ย้อนกลับ" title="ย้อนกลับ" onClick={() => window.history.back()}>
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button className="nav-arrow" type="button" aria-label="ไปข้างหน้า" title="ไปข้างหน้า" onClick={() => window.history.forward()}>
          <i className="fa-solid fa-chevron-right" />
        </button>
        <div className="header-list-summary">
          <span className="label">{label}</span>
          <span className="count">({itemCount} รายการ)</span>
        </div>
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
