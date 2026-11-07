export default function PlayerPanel({
  currentSong, playing, progress, volume, audioRef, favoriteIds,
  onToggleFavorite, onProgressChange, onVolumeChange, onMoveSong, onTogglePlay,
}) {
  const isFavorite = currentSong && favoriteIds.has(String(currentSong.id));
  const audioTime = audioRef.current?.currentTime || 0;
  const time = `${Math.floor(audioTime / 60)}:${String(Math.floor(audioTime % 60)).padStart(2, '0')}`;

  return (
    <section className="player-column">
      <div className="detail-panel">
        <small>ข้อมูลรายละเอียดเพลง</small>
        <h1>{currentSong?.title || 'เลือกเพลงเพื่อฟัง'}</h1>
        <p>ศิลปิน: {currentSong?.artist?.name || '-'}</p>
        <p>อัลบั้ม: {currentSong?.album?.title || '-'}</p>
        <div className="detail-grid">
          <div><span>ความนิยม</span><strong>{currentSong ? currentSong.rank.toLocaleString() : '-'}</strong></div>
        </div>
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
