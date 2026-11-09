export default function ArtistDetail({ artist }) {
  if (!artist) return null;

  return (
    <div className="artist-detail">
      <img
        className="artist-detail-cover"
        src={artist.picture_xl || artist.picture_big || artist.picture_medium || artist.picture_small}
        alt={artist.name}
      />
      <div className="artist-detail-info">
        <small>ข้อมูลนักร้อง</small>
        <h2>{artist.name}</h2>
        <div className="artist-detail-stats">
          <div>
            <strong>{artist.albumCount.toLocaleString()}</strong>
            <span>อัลบั้ม</span>
          </div>
          <div>
            <strong>{artist.songCount.toLocaleString()}</strong>
            <span>เพลงยอดนิยม</span>
          </div>
        </div>
      </div>
    </div>
  );
}
