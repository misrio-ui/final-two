export default function AlbumCard({ album, onOpen }) {
  return (
    <article className="song-card">
      <img src={album.cover_medium || album.cover_small} alt="" />
      <div className="song-info">
        <strong>{album.title}</strong>
        <span>{album.artist?.name || '-'}</span>
        <small>{album.count ? `ติดชาร์ต ${album.count} เพลง` : 'ผลลัพธ์การค้นหา'}</small>
      </div>
      <button className="view-button" onClick={() => onOpen(album.id)}>เปิดอัลบั้ม</button>
    </article>
  );
}
