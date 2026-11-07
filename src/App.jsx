import { useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import ContentPanel from './components/ContentPanel.jsx';
import PlayerPanel from './components/PlayerPanel.jsx';

const api = async (endpoint) => {
  const response = await fetch(`/api/deezer/${endpoint}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `API request failed (${response.status})`);
  }
  return response.json();
};

const loadSavedVolume = () => {
  const savedVolume = Number(localStorage.getItem('music-player-volume'));
  return Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : 0.8;
};

const loadSavedFavorites = () => {
  try {
    const favorites = JSON.parse(localStorage.getItem('music-player-favorites') || '[]');
    return Array.isArray(favorites) ? favorites : [];
  } catch {
    return [];
  }
};

export default function App() {
  const [view, setView] = useState('songs');
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songIndex, setSongIndex] = useState(() => new Map());
  const [currentSong, setCurrentSong] = useState(null);
  const [query, setQuery] = useState('');
  const [label, setLabel] = useState('เพลงฮิตจาก Deezer');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [sortStatus, setSortStatus] = useState('');
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(loadSavedVolume);
  const [favorites, setFavorites] = useState(loadSavedFavorites);
  const [favoriteIndex, setFavoriteIndex] = useState(() => new Map(
    loadSavedFavorites().map((song) => [String(song.id), song])
  ));
  const audioRef = useRef(null);
  const searchTimer = useRef(null);

  const indexSongs = (items) => {
    const index = new Map();
    items.forEach((song) => index.set(String(song.id), song));
    setSongIndex(index);
    return items;
  };

  const mapTrack = (track) => ({
    id: track.id,
    title: track.title,
    rank: track.rank || 0,
    preview: track.preview,
    artist: track.artist || {},
    album: track.album || {},
  });

  const loadSongs = async (source = 'chart', searchQuery = 'music', itemId = null) => {
    setStatus('loading');
    setError('');
    setView('songs');
    try {
      let data;
      let tracks = [];
      let nextLabel = 'เพลงฮิตจาก Deezer';

      if (source === 'search') {
        data = await api(`search/track?q=${encodeURIComponent(searchQuery)}&limit=100`);
        tracks = data.data || [];
        nextLabel = `ค้นหา: ${searchQuery}`;
      } else if (source === 'album') {
        data = await api(`album/${itemId}`);
        tracks = (data.tracks?.data || []).map(mapTrack);
        nextLabel = `${data.title} · ${data.artist?.name || ''}`;
      } else if (source === 'artist') {
        const artist = await api(`artist/${itemId}`);
        data = await api(`artist/${itemId}/top?limit=100`);
        tracks = data.data || [];
        nextLabel = `${artist.name} · เพลงยอดนิยม`;
      } else {
        data = await api('chart/0/tracks?limit=100');
        tracks = data.data || [];
      }

      const mapped = indexSongs(tracks.map(mapTrack).filter((song) => song.preview && song.album?.id !== 302127));
      setSongs(mapped);
      setLabel(nextLabel);
      setSortStatus('');
      setStatus(mapped.length ? 'success' : 'empty');
      setCurrentSong(mapped[0] || null);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const loadAlbums = async (searchQuery = '') => {
    setView('albums');
    setStatus('loading');
    setError('');
    try {
      if (searchQuery.trim()) {
        const data = await api(`search/album?q=${encodeURIComponent(searchQuery.trim())}&limit=100`);
        const items = (data.data || []).map((album, index) => ({
          ...album,
          position: index + 1,
          cover_medium: album.cover_medium || album.cover,
          cover_small: album.cover_small || album.cover,
          artist: album.artist || {},
          count: null,
        }));
        setAlbums(items);
        setLabel(`ค้นหาอัลบั้ม: ${searchQuery.trim()}`);
        setStatus(items.length ? 'success' : 'empty');
        return;
      }

      const data = await api('chart/0/tracks?limit=100');
      const byId = new Map();
      data.data.forEach((track, index) => {
        if (!track.album || track.album.id === 302127) return;
        if (!byId.has(track.album.id)) {
          byId.set(track.album.id, {
            id: track.album.id,
            title: track.album.title,
            cover_medium: track.album.cover_medium || track.album.cover,
            cover_small: track.album.cover_small || track.album.cover,
            artist: track.artist,
            position: track.position || index + 1,
            count: 1,
          });
        } else {
          byId.get(track.album.id).count += 1;
        }
      });
      const items = [...byId.values()].slice(0, 100);
      setAlbums(items);
      setLabel('อัลบั้มจาก Deezer');
      setStatus(items.length ? 'success' : 'empty');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const loadArtists = async (searchQuery = '') => {
    setView('artists');
    setStatus('loading');
    setError('');
    try {
      if (searchQuery.trim()) {
        const data = await api(`search/artist?q=${encodeURIComponent(searchQuery.trim())}&limit=100`);
        const items = (data.data || []).map((artist, index) => ({ ...artist, position: index + 1 }));
        setArtists(items);
        setLabel(`ค้นหานักร้อง: ${searchQuery.trim()}`);
        setStatus(items.length ? 'success' : 'empty');
        return;
      }

      const data = await api('chart/0/artists?limit=100');
      const items = (data.data || []).map((artist, index) => ({ ...artist, position: index + 1 }));
      setArtists(items);
      setLabel('นักร้องฮิตจาก Deezer');
      setStatus(items.length ? 'success' : 'empty');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!query.trim()) {
      if (view === 'favorites') loadFavorites();
      return;
    }
    searchTimer.current = setTimeout(() => {
      if (view === 'artists') loadArtists(query.trim());
      else if (view === 'albums') loadAlbums(query.trim());
      else if (view === 'favorites') loadFavorites(query.trim());
      else loadSongs('search', query.trim());
    }, 500);
    return () => clearTimeout(searchTimer.current);
  }, [query, view]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    localStorage.setItem('music-player-volume', String(volume));
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('music-player-favorites', JSON.stringify(favorites));
    setFavoriteIndex(new Map(favorites.map((song) => [String(song.id), song])));
  }, [favorites]);

  const toggleFavorite = (song) => {
    if (!song) return;
    const exists = favoriteIndex.has(String(song.id));
    const next = exists
      ? favorites.filter((item) => String(item.id) !== String(song.id))
      : [song, ...favorites];
    setFavorites(next);
    if (view === 'favorites') {
      setSongs(next);
      indexSongs(next);
      setLabel('เพลงที่ถูกใจ');
      setStatus(next.length ? 'success' : 'empty');
    }
  };

  const loadFavorites = (searchQuery = '') => {
    setView('favorites');
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    const items = normalizedQuery
      ? favorites.filter((song) =>
        `${song.title} ${song.artist?.name || ''} ${song.album?.title || ''}`
          .toLocaleLowerCase().includes(normalizedQuery))
      : favorites;
    indexSongs(items);
    setSongs(items);
    setLabel(normalizedQuery ? `เพลงที่ถูกใจ: ${searchQuery.trim()}` : 'เพลงที่ถูกใจ');
    setSortStatus('');
    setStatus(items.length ? 'success' : 'empty');
  };

  const selectSong = async (songId, autoPlay = true) => {
    const song = songIndex.get(String(songId));
    if (!song) return;
    setCurrentSong(song);
    setStatus((old) => old === 'error' ? old : 'success');
    if (autoPlay && audioRef.current) {
      audioRef.current.src = song.preview;
      audioRef.current.play().catch(() => setPlaying(false));
    }
  };

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;
    audioRef.current.src = currentSong.preview || '';
    audioRef.current.load();
  }, [currentSong]);

  const togglePlay = () => {
    if (!currentSong?.preview) return;
    if (audioRef.current.paused) audioRef.current.play();
    else audioRef.current.pause();
  };

  const moveSong = (direction) => {
    if (!songs.length || !currentSong) return;
    const position = songs.findIndex((song) => song.id === currentSong.id);
    const next = (position + direction + songs.length) % songs.length;
    selectSong(songs[next].id, true);
  };

  const sortSongs = () => {
    const descending = sortStatus.includes('มาก -> น้อย');
    const next = [...songs].sort((a, b) =>
      descending ? a.rank - b.rank : b.rank - a.rank
    );
    setSongs(next);
    setSortStatus(descending ? 'น้อย -> มาก' : 'มาก -> น้อย');
  };

  const searchCurrentView = () => {
    const searchQuery = query.trim();
    if (!searchQuery) return;
    if (view === 'artists') loadArtists(searchQuery);
    else if (view === 'albums') loadAlbums(searchQuery);
    else if (view === 'favorites') loadFavorites(searchQuery);
    else loadSongs('search', searchQuery);
  };

  return (
    <div className="app-shell">
      <Header
        view={view}
        query={query}
        favoritesCount={favorites.length}
        onQueryChange={setQuery}
        onSearch={searchCurrentView}
        onSongs={() => loadSongs(query.trim() ? 'search' : 'chart', query.trim())}
        onArtists={() => loadArtists(query.trim())}
        onAlbums={() => loadAlbums(query.trim())}
        onSort={sortSongs}
        onFavorites={() => {
          setQuery('');
          loadFavorites();
        }}
      />
      <main>
        <ContentPanel
          view={view}
          label={label}
          status={status}
          error={error}
          sortStatus={sortStatus}
          songs={songs}
          albums={albums}
          artists={artists}
          currentSong={currentSong}
          playing={playing}
          onSelectSong={selectSong}
          onOpenAlbum={(albumId) => loadSongs('album', '', albumId)}
          onOpenArtist={(artistId) => loadSongs('artist', '', artistId)}
        />
        <PlayerPanel
          currentSong={currentSong}
          playing={playing}
          progress={progress}
          volume={volume}
          audioRef={audioRef}
          favoriteIds={favoriteIndex}
          onToggleFavorite={() => toggleFavorite(currentSong)}
          onProgressChange={(value) => {
            setProgress(value);
            if (audioRef.current?.duration) {
              audioRef.current.currentTime = audioRef.current.duration * value / 100;
            }
          }}
          onVolumeChange={setVolume}
          onMoveSong={moveSong}
          onTogglePlay={togglePlay}
        />
      </main>
      <audio ref={audioRef} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setProgress(audio.duration ? audio.currentTime / audio.duration * 100 : 0);
        }} />
    </div>
  );
}
