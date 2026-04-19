import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DetailSurah({
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
    // Ambil detail surah
    fetch(`https://equran.id/api/v2/surat/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedSurah(data.data);
        setAyat(data.data.ayat);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

    // Ambil tafsir
    fetch(`https://equran.id/api/v2/tafsir/${id}`)
      .then((res) => res.json())
      .then((data) => setTafsirData(data.data.tafsir));
  }, [id]);

  if (!selectedSurah) return null;

  return (
    <div className="detail">
      {/* ================= HEADER STICKY ================= */}
      <div className="stickyHeader">
        <button
          className="backBtn btn btn-outline-success btn-sm"
          onClick={() => navigate("/")}
        >
          <i className="bi bi-arrow-left"></i> Kembali
        </button>

        <p className="arabMini">{selectedSurah.nama}</p>
      </div>

      {/* ================= DETAIL HEADER ================= */}
      <div className="detailHeader text-center">
        <h2>{selectedSurah.namaLatin}</h2>
        <h2 className="arabTitle">{selectedSurah.nama}</h2>

        <p>
          {selectedSurah.arti} • {selectedSurah.jumlahAyat} ayat
        </p>

        {/* ================= AUDIO SURAH ================= */}
        <div className="audioControls">
          <button
            className="audioBtn btn btn-success"
            onClick={() =>
              playAudio(selectedSurah.audioFull["05"])
            }
          >
            {isPlaying &&
            currentAudio?.src?.includes(
              selectedSurah.audioFull["05"]
            ) ? (
              <>
                <i className="bi bi-pause-fill"></i> Pause
              </>
            ) : (
              <>
                <i className="bi bi-play-fill"></i> Play
              </>
            )}
          </button>

          <button
            className="stopBtn btn btn-danger"
            onClick={stopAudio}
            disabled={!currentAudio}
          >
            <i className="bi bi-stop-fill"></i> Stop
          </button>
        </div>

        {/* ================= DESKRIPSI ================= */}
        <p
          className="surahDesc"
          dangerouslySetInnerHTML={{
            __html: selectedSurah.deskripsi,
          }}
        ></p>
      </div>

      {/* ================= LIST AYAT ================= */}
      <div className="ayatList">
        {ayat.map((a) => (
          <div key={a.nomorAyat} className="ayatCard">
            <div className="ayatNumber">{a.nomorAyat}</div>

            {/* AUDIO AYAT */}
            <button
              className="ayatAudioBtn btn btn-success"
              onClick={() => playAudio(a.audio["05"])}
            >
              {isPlaying &&
              currentAudio?.src?.includes(a.audio["05"]) ? (
                <i className="bi bi-pause-fill"></i>
              ) : (
                <i className="bi bi-play-fill"></i>
              )}
            </button>

            <button
              className="ayatStopBtn btn btn-danger btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                stopAudio();
              }}
            >
              <i className="bi bi-stop-fill"></i>
            </button>

            {/* TAFSIR BUTTON */}
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

            {/* TEKS */}
            <p className="arabText">{a.teksArab}</p>
            <p className="latinText">{a.teksLatin}</p>
            <p className="indoText">{a.teksIndonesia}</p>

            {/* TAFSIR */}
            {openTafsir === a.nomorAyat && (
              <div className="tafsirBox">
                {tafsirData?.find(
                  (t) => t.ayat === a.nomorAyat
                )?.teks || "Tafsir tidak tersedia"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailSurah;