import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [surah, setSurah] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayat, setAyat] = useState([]);
  const [search, setSearch] = useState("");
  const [showScroll, setShowScroll] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tafsirData, setTafsirData] = useState([]);
  const [openTafsir, setOpenTafsir] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const rekomendasiIds = [36, 18, 55, 67, 56];

  useEffect(() => {
    fetch("https://equran.id/api/v2/surat")
      .then((res) => res.json())
      .then((data) => setSurah(data.data));

    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ================= AUDIO =================
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

  // ================= API =================
  const handleClick = (nomor) => {
    fetch(`https://equran.id/api/v2/surat/${nomor}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedSurah(data.data);
        setAyat(data.data.ayat);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    fetch(`https://equran.id/api/v2/tafsir/${nomor}`)
      .then((res) => res.json())
      .then((data) => setTafsirData(data.data.tafsir));
  };

  const toggleFavorite = (nomor) => {
    let updated = favorites.includes(nomor)
      ? favorites.filter((f) => f !== nomor)
      : [...favorites, nomor];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className="container myContainer">

      {/* ================= LIST VIEW ================= */}
      {!selectedSurah && (
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
              <h2 className="sectionTitle">❤️ Favorit</h2>
              <div className="list">
                {favoriteSurah.map((s) => (
                  <div key={s.nomor} className="surahItem">
                    <div className="left" onClick={() => handleClick(s.nomor)}>
                      <div className="number">{s.nomor}</div>
                      <div>
                        <h3>{s.namaLatin}</h3>
                        <p className="arti">{s.arti}</p>
                      </div>
                    </div>

                    {/* 🔥 FIX FAVORITE BUTTON */}
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
          <h2 className="sectionTitle">📚 Rekomendasi</h2>
          <div className="horizontalScroll">
            {rekomendasiSurah.map((s) => (
              <div
                key={s.nomor}
                className="rekomCard"
                onClick={() => handleClick(s.nomor)}
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
                onClick={() => handleClick(s.nomor)}
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
      )}

      {/* ================= DETAIL VIEW ================= */}
      {selectedSurah && (
        <div className="detail">

          <div className="stickyHeader">
            <button
              className="backBtn btn btn-outline-success btn-sm"
              onClick={() => setSelectedSurah(null)}
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
                ▶️ Play
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
                  🔊
                </button>

                <button
                  className="tafsirBtn btn btn-secondary btn-sm"
                  onClick={() =>
                    setOpenTafsir(
                      openTafsir === a.nomorAyat ? null : a.nomorAyat
                    )
                  }
                >
                  📖 Tafsir
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
      )}

      {/* SCROLL */}
      {showScroll && (
        <button className="scrollTopBtn btn btn-success" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

export default App;