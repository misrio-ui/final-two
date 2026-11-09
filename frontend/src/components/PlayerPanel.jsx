export default function PlayerPanel({
  currentSong, artistDetail, albumDetail, playing, progress, volume, audioRef, favoriteIds,
  onToggleFavorite, onProgressChange, onVolumeChange, onMoveSong, onTogglePlay,
  onArtistAlbums, onArtistSongs, onSongArtist, onSongAlbum, onAlbumArtist, onAlbumSongs,
}) {
  const isFavorite = currentSong && favoriteIds.has(String(currentSong.id));
  const audioTime = audioRef.current?.currentTime || 0;
  const time = `${Math.floor(audioTime / 60)}:${String(Math.floor(audioTime % 60)).padStart(2, '0')}`;

  return (
    <section className="player-column">
      <div className="detail-panel">
        <small>{artistDetail ? 'ข้อมูลนักร้อง' : albumDetail ? 'ข้อมูลอัลบั้ม' : 'ข้อมูลรายละเอียดเพลง'}</small>
        <h1>{artistDetail?.name || albumDetail?.title || currentSong?.title || 'เลือกเพลงเพื่อฟัง'}</h1>
        {artistDetail ? (
          <>
            <p>นักร้อง: {artistDetail.name}</p>
            <div className="detail-grid">
              <button type="button" onClick={onArtistAlbums}>
                <span>จำนวนอัลบั้ม</span><strong>{artistDetail.albumCount.toLocaleString()}</strong>
              </button>
              <button type="button" onClick={onArtistSongs}>
                <span>จำนวนเพลงยอดนิยม</span><strong>{artistDetail.songCount.toLocaleString()}</strong>
              </button>
            </div>
          </>
        ) : albumDetail ? (
          <>
            <p>อัลบั้ม: {albumDetail.title}</p>
            <div className="detail-grid">
              <button type="button" onClick={onAlbumArtist}>
                <span>ศิลปิน</span><strong>{albumDetail.artist?.name || '-'}</strong>
              </button>
              <button type="button" disabled={!albumDetail.songCount} onClick={onAlbumSongs}>
                <span>เพลงในอัลบั้ม</span><strong>{albumDetail.songCount?.toLocaleString() || '0'}</strong>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="detail-grid">
              <button type="button" onClick={onSongArtist} disabled={!currentSong?.artist?.id}>
                <span>ศิลปิน</span><strong>{currentSong?.artist?.name || '-'}</strong>
              </button>
              <button type="button" onClick={onSongAlbum} disabled={!currentSong?.album?.id}>
                <span>อัลบั้ม</span><strong>{currentSong?.album?.title || '-'}</strong>
              </button>
            </div>
          </>
        )}
      </div>
      <div className="player-panel">
        <button
          className={`favorite-song-button ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          disabled={!currentSong}
          aria-label={isFavorite ? 'ยกเลิกเพลงที่ถูกใจ' : 'บันทึกเป็นเพลงที่ถูกใจ'}
          title={isFavorite ? 'ยกเลิกเพลงที่ถูกใจ' : 'ถูกใจเพลงนี้'}
        >
          <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`} />
        </button>
        <div className={`vinyl ${playing ? '' : 'paused'}`}>
          <img
            src={currentSong?.album?.cover_medium || currentSong?.album?.cover_small || 'https://placehold.co/160x160/666666/ffffff?text=Deezer'}
            alt="ปกอัลบั้ม"
          />
        </div>
        <input
          aria-label="ตำแหน่งเพลง"
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(event) => onProgressChange(Number(event.target.value))}
        />
        <div className="time-row"><span>{time}</span><span>0:30 Preview</span></div>
        <div className="controls">
          <input
            aria-label="ระดับเสียง"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
          />
          <button onClick={() => onMoveSong(-1)} aria-label="เพลงก่อนหน้า"><i className="fa-solid fa-backward-step" /></button>
          <button className="play-button" onClick={onTogglePlay} aria-label="เล่นหรือหยุดเพลง"><i className={`fa-solid ${playing ? 'fa-pause' : 'fa-play'}`} /></button>
          <button onClick={() => onMoveSong(1)} aria-label="เพลงถัดไป"><i className="fa-solid fa-forward-step" /></button>
        </div>
      </div>
    </section>
  );
}
