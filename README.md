# Deezer Music Player

เว็บค้นหาและเล่นตัวอย่างเพลง Deezer ที่ใช้ React + Vite ฝั่งหน้าเว็บ และ Express API proxy ฝั่งเซิร์ฟเวอร์

## ฟีเจอร์

- ค้นหาแยกตามแท็บ: เพลงค้นจาก `search/track`, นักร้องจาก `search/artist`, และอัลบั้มจาก `search/album`
- แสดงผลสูงสุด 100 รายการตามทุก endpoint ที่รองรับ
- เรียงยอดนิยมสองทาง: มากไปน้อยและน้อยไปมาก
- เล่น preview 30 วินาที พร้อมแผ่นเสียง แทบ timeline และควบคุมระดับเสียง
- จำระดับเสียงและรายการ Favorites ด้วย `localStorage`
- เปิดมุมมอง Favorites และค้นหาเฉพาะในรายการที่ถูกใจ
- แสดง loading, empty, success และ error state

## สถาปัตยกรรม

```text
React/Vite UI
  -> /api/deezer/*
  -> Express proxy: validation, limit, timeout, normalization, TTL cache
  -> Deezer API
```

Frontend หลักอยู่ใน `src/`, backend อยู่ใน `server.js`, และ Vite build อยู่ใน `dist/`

## Component Tree

```text
App
├── Header
│   ├── FilterNavigation
│   ├── SearchBox
│   └── FavoritesButton
├── ContentPanel
│   ├── Status
│   ├── SongCard
│   ├── AlbumCard
│   └── ArtistCard
└── PlayerPanel
    ├── SongDetails
    └── AudioControls
```

โค้ด component ที่แยกจริงอยู่ใน [src/components/](src/components/) โดย `App.jsx` เป็นส่วน orchestration ของ state และ API calls

ไฟล์ component สำคัญ:

- `Header.jsx`, `SearchBox.jsx`, `FavoritesButton.jsx`
- `ContentPanel.jsx`, `Status.jsx`, `SongCard.jsx`, `AlbumCard.jsx`, `ArtistCard.jsx`
- `PlayerPanel.jsx`

## DSA และ Big-O

| โครงสร้าง/ขั้นตอน | การใช้งาน | ความซับซ้อน | หลักฐาน |
|---|---|---:|---|
| `Map` index เพลง | เลือกเพลงและเลื่อนก่อนหน้า/ถัดไปด้วย ID | Lookup `O(1)` โดยเฉลี่ย | `src/App.jsx` ฟังก์ชัน `indexSongs`, `selectSong` |
| `Map` index Favorites | ตรวจว่าเพลงถูกใจอยู่หรือไม่ | Lookup `O(1)` โดยเฉลี่ย | state `favoriteIndex` ใน `src/App.jsx` และปุ่มหัวใจใน `PlayerPanel` |
| `Map` อัลบั้ม | รวมอัลบั้มไม่ซ้ำจากชาร์ต | `O(n)` โดยเฉลี่ย | `src/App.jsx` ฟังก์ชัน `loadAlbums` |
| `Array.sort()` | เรียงยอดนิยมมากไปน้อย/น้อยไปมาก | `O(n log n)` โดยเฉลี่ย | `src/App.jsx` ฟังก์ชัน `sortSongs` |
| Debounce | รอการพิมพ์ 500 ms ก่อนค้นหา | ลด API calls ระหว่างการพิมพ์ | `searchTimer` ใน `src/App.jsx` |
| TTL cache ใน Express | Cache response ด้วย URL เป็น key เป็นเวลา 60 วินาที | Lookup ลำดับเฉลี่ย `O(1)` ต่อ cache entry | `responseCache` ใน `server.js` |

ตัวเลข Big-O เป็นค่าประมาณ Map lookup จะเป็น average-case ไม่ใช่ worst-case และ JavaScript engine ของ `.sort()` มีขั้นตอนประมาณ `O(n log n)`

## Before → After และหลักฐานข้อเสนอแนะจากงานแรก

| ข้อเสนอแนะ/ปัญหาก่อนหน้า | ก่อนแก้ | หลังแก้ | หลักฐาน |
|---|---|---|---|
| แยก UI ตามประเภทข้อมูล | ค้นหาเดียวส่ง endpoint รวม | แท็บเพลง/นักร้อง/อัลบั้มเรียก endpoint เฉพาะ | `src/App.jsx`, `src/components/Header.jsx` |
| จำกัดข้อมูล API | ผลลัพธ์และ chart หลายจุดค้างที่ 50 | จำกัดและ normalise ให้เป็น 100 รายการ | `src/App.jsx`, `server.js` |
| ระบบเรียงที่ไม่จำเป็น | มีตัวเลือกเริ่มต้นและความยาว | เหลือเฉพาะยอดนิยม มาก/น้อย | `src/App.jsx` ฟังก์ชัน `sortSongs` |
| Request ซ้ำทุก keypress | เรียก API ทุกการพิมพ์ | debounce 500 ms | `src/App.jsx` |
| API proxy ยังไม่ทำงานจริง | ไม่มี cache/validation | endpoint allowlist, timeout, limit และ TTL cache | `server.js` |
| ไม่มีสิ่งคงค้างหลัง refresh | Volume รีเซ็ตและไม่มี Favorites | ใช้สอง key ใน `localStorage` | `src/App.jsx` |
| Array scan สำหรับ Favorites | ใช้ `.some()` และ `.filter()` กับรายการ | เก็บ `favoriteIndex` เป็น `Map` เพิ่ม/ตรวจด้วย ID | `src/App.jsx` |
| Loading UI ไม่ครบ | ไม่มีรายละเอียดของเหตุผิดพลาด | มี loading, empty, success และ error | `src/components/Status.jsx` |

## สถานะ UI

- Loading: วงหมุน “กำลังโหลดข้อมูล”
- Empty: ไม่พบข้อมูลหรือ Favorites ว่าง
- Error: แสดงข้อความจาก Express/Deezer API
- Success: แสดง card ของเพลง อัลบั้ม หรือนักร้อง

## การติดตั้งและรัน

Node.js 18 หรือใหม่กว่า

```powershell
npm.cmd install
npm.cmd run build
npm.cmd start
```

เปิด `http://localhost:3000`

สำหรับพัฒนา:

```powershell
npm.cmd run dev
```

ทดสอบ API:

- Health check: `http://localhost:3000/api/health`
- Chart 100 รายการ: `http://localhost:3000/api/deezer/chart/0/tracks?limit=100`
- ค้นหาเพลง: `http://localhost:3000/api/deezer/search/track?q=test&limit=100`

## ตารางความรับผิดชอบ

| สมาชิก | หน้าที่หลัก | ไฟล์หลัก |
|---|---|---|
| ผู้พัฒนา 1 | React UI, component tree, player และ Favorites | `src/App.jsx`, `src/components/`, `src/styles.css` |
| ผู้พัฒนา 1 | Express proxy, validation, cache และ error handling | `server.js` |
| ผู้พัฒนา 1 | README, Big-O, Before/After และการนำเสนอ | `README.md` |