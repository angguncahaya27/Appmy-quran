 import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";

function Home({
  surah,
  search,
  setSearch,
  favorites,
  toggleFavorite,
  rekomendasiIds,
}) {
  const navigate = useNavigate();

  const filteredSurah = surah.filter((s) =>
    s.namaLatin.toLowerCase().includes(search.toLowerCase())
  );

  const rekomendasiSurah = surah.filter((s) =>
    rekomendasiIds.includes(s.nomor)
  );

  const favoriteSurah = surah.filter((s) =>
    favorites.includes(s.nomor)
  );

  return (
    <>
      <h1 className="title text-center">🌿 Al-Qur'an Digital</h1>

      <input
        className="search form-control mx-auto"
        placeholder="Cari surat..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FAVORIT */}
      {favoriteSurah.length > 0 && (
        <>
          <h2 className="sectionTitle"> Favorit</h2>
          <div className="list">
            {favoriteSurah.map((s) => (
              <div key={s.nomor} className="surahItem">
                <div
                  className="left"
                  onClick={() => navigate(`/surah/${s.nomor}`)}
                >
                  <div className="number">{s.nomor}</div>
                  <div>
                    <h3>{s.namaLatin}</h3>
                    <p className="arti">{s.arti}</p>
                  </div>
                </div>

                <button
                  className={`favBtn btn ${
                    favorites.includes(s.nomor)
                      ? "active btn-danger"
                      : "btn-light"
                  }`}
                  onClick={() => toggleFavorite(s.nomor)}
                >
                  ❤️
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* REKOMENDASI */}
      <h2 className="sectionTitle"> Rekomendasi</h2>
      <div className="horizontalScroll">
        {rekomendasiSurah.map((s) => (
          <div
            key={s.nomor}
            className="rekomCard"
            onClick={() => navigate(`/surah/${s.nomor}`)}
          >
            <h3>{s.namaLatin}</h3>
            <p className="arab">{s.nama}</p>
            <small>{s.jumlahAyat} ayat</small>
          </div>
        ))}
      </div>

      {/* LIST */}
      <div className="list">
        {filteredSurah.map((s) => (
          <div
            key={s.nomor}
            className="surahItem"
            onClick={() => navigate(`/surah/${s.nomor}`)}
          >
            <div className="left">
              <div className="number">{s.nomor}</div>
              <div>
                <h3>{s.namaLatin}</h3>
                <p className="arti">{s.arti}</p>
              </div>
            </div>

            <div className="right">
              <p className="arab">{s.nama}</p>
              <small>{s.jumlahAyat} ayat</small>
            </div>

            <button
              className={`favBtn btn ${
                favorites.includes(s.nomor)
                  ? "active btn-danger"
                  : "btn-light"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(s.nomor);
              }}
            >
              ❤️
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function Detail({
  playAudio,
  stopAudio,
  currentAudio,
  isPlaying,
  tafsirData,
  setTafsirData,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayat, setAyat] = useState([]);
  const [openTafsir, setOpenTafsir] = useState(null);

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedSurah(data.data);
        setAyat(data.data.ayat);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    fetch(`https://equran.id/api/v2/tafsir/${id}`)
      .then((res) => res.json())
      .then((data) => setTafsirData(data.data.tafsir));
  }, [id]);

  if (!selectedSurah) return null;

  return (
    <div className="detail">
      <div className="stickyHeader">
        <button
          className="backBtn btn btn-outline-success btn-sm"
          onClick={() => navigate("/")}
        >
          ← Kembali
        </button>

        <p className="arabMini">{selectedSurah.nama}</p>
      </div>

      <div className="detailHeader text-center">
        <h2>{selectedSurah.namaLatin}</h2>
        <h2 className="arabTitle">{selectedSurah.nama}</h2>

        <p>
          {selectedSurah.arti} • {selectedSurah.jumlahAyat} ayat
        </p>

        <div className="audioControls">
          <button
            className="audioBtn btn btn-success"
            onClick={() => playAudio(selectedSurah.audioFull["05"])}
          >
            {currentAudio &&
            currentAudio.src === selectedSurah.audioFull["05"] &&
            isPlaying
              ? "⏸️ Pause"
              : "▶️ Play"}
          </button>

          <button className="stopBtn btn btn-danger" onClick={stopAudio}>
            ⏹ Stop
          </button>
        </div>

        <p
          className="surahDesc"
          dangerouslySetInnerHTML={{
            __html: selectedSurah.deskripsi,
          }}
        ></p>
      </div>

      <div className="ayatList">
        {ayat.map((a) => (
          <div key={a.nomorAyat} className="ayatCard">
            <div className="ayatNumber">{a.nomorAyat}</div>

            <button
              className="ayatAudioBtn btn btn-success"
              onClick={() => playAudio(a.audio["05"])}
            >
              {currentAudio &&
              currentAudio.src === a.audio["05"] &&
              isPlaying
                ? "⏸️"
                : "▶️"}
            </button>

            <button
              className="tafsirBtn btn btn-secondary btn-sm"
              onClick={() =>
                setOpenTafsir(
                  openTafsir === a.nomorAyat ? null : a.nomorAyat
                )
              }
            >
              Tafsir
            </button>

            <p className="arabText">{a.teksArab}</p>
            <p className="latinText">{a.teksLatin}</p>
            <p className="indoText">{a.teksIndonesia}</p>

            {openTafsir === a.nomorAyat && (
              <div className="tafsirBox">
                {
                  tafsirData.find((t) => t.ayat === a.nomorAyat)?.teks ||
                  "Tafsir tidak tersedia"
                }
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [surah, setSurah] = useState([]);
  const [search, setSearch] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tafsirData, setTafsirData] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const rekomendasiIds = [36, 18, 55, 67, 56];

  useEffect(() => {
    fetch("https://equran.id/api/v2/surat")
      .then((res) => res.json())
      .then((data) => setSurah(data.data));

    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const playAudio = (url) => {
    if (!url) return;

    if (currentAudio && currentAudio.src === url) {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play();
        setIsPlaying(true);
      }
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(url);
    audio.play();

    setCurrentAudio(audio);
    setIsPlaying(true);

    audio.onended = () => setIsPlaying(false);
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const toggleFavorite = (nomor) => {
    let updated = favorites.includes(nomor)
      ? favorites.filter((f) => f !== nomor)
      : [...favorites, nomor];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="container myContainer">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              surah={surah}
              search={search}
              setSearch={setSearch}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              rekomendasiIds={rekomendasiIds}
            />
          }
        />
        <Route
          path="/surah/:id"
          element={
            <Detail
              playAudio={playAudio}
              stopAudio={stopAudio}
              currentAudio={currentAudio}
              isPlaying={isPlaying}
              tafsirData={tafsirData}
              setTafsirData={setTafsirData}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
