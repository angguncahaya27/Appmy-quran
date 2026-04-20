import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetailSurah from "./pages/DetailSurah";
import Profile from "./pages/profile/profile";
import "./App.css";

function App() {
  const [surah, setSurah] = useState([]);
  const [search, setSearch] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tafsirData, setTafsirData] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const rekomendasiIds = [36, 18, 55, 67, 56];

  // ================= FETCH DATA =================
  useEffect(() => {
    fetch("https://equran.id/api/v2/surat")
      .then((res) => res.json())
      .then((data) => setSurah(data.data))
      .catch((err) => console.error("Gagal fetch data:", err));

    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // ================= AUDIO CONTROL =================
  const playAudio = (url) => {
    if (!url) return;

    // Jika audio sama → toggle play/pause
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

    // Stop audio lama
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(url);
    audio.play();

    setCurrentAudio(audio);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // ================= FAVORITE =================
  const toggleFavorite = (nomor) => {
    if (!favorites.includes(nomor) && favorites.length >= 5) {
      alert("Maksimal 5 favorit!");
      return;
    }

    let updatedFavorites;

    if (favorites.includes(nomor)) {
      updatedFavorites = favorites.filter((f) => f !== nomor);
    } else {
      updatedFavorites = [...favorites, nomor];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem(
      "favorites",
      JSON.stringify(updatedFavorites)
    );
  };

  return (
    <div className="container myContainer">
      <Routes>

        {/* ================= HOME ================= */}
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

        {/* ================= DETAIL SURAH ================= */}
        <Route
          path="/surah/:id"
          element={
            <DetailSurah
              playAudio={playAudio}
              stopAudio={stopAudio}
              currentAudio={currentAudio}
              isPlaying={isPlaying}
              tafsirData={tafsirData}
              setTafsirData={setTafsirData}
            />
          }
        />

        {/* ================= PROFILE ================= */}
        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>
    </div>
  );
}

export default App;