import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetailSurah from "./pages/DetailSurah";
import "./App.css";

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
    if (!favorites.includes(nomor) && favorites.length >= 5) {
      alert("Maksimal 5 favorit!");
      return;
    }

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
      </Routes>
    </div>
  );
}

export default App;