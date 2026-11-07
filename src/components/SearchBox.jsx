export default function SearchBox({ value, placeholder, ariaLabel, onChange, onSearch }) {
  return (
    <div className="search-box">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSearch();
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      <button onClick={onSearch} aria-label="ค้นหา">
        <i className="fa-solid fa-magnifying-glass" />
      </button>
    </div>
  );
}
