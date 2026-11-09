export default function FavoritesButton({ active, count, onClick }) {
  return (
    <button
      className={`favorite-view-button ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-label="ดูเพลงที่ถูกใจ"
      title="เพลงที่ถูกใจ"
    >
      <i className="fa-solid fa-heart" />
      <span>{count}</span>
    </button>
  );
}
