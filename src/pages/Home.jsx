import { useNavigate } from "react-router-dom";

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

      {/* SEARCH + PROFILE */}
      <div className="searchWrapper">
        <input
          className="search form-control"
          placeholder="Cari surat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="profileBtn btn btn-outline-success"
          onClick={() => navigate("/profile")}
        >
          <i className="bi bi-person-circle"></i>
        </button>
      </div>

      {/* ================= FAVORIT ================= */}
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
                  <i
                    className={`bi ${
                      favorites.includes(s.nomor)
                        ? "bi-heart-fill"
                        : "bi-heart"
                    }`}
                  ></i>
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= REKOMENDASI ================= */}
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

      {/* ================= LIST ================= */}
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
              <i
                className={`bi ${
                  favorites.includes(s.nomor)
                    ? "bi-heart-fill"
                    : "bi-heart"
                }`}
              ></i>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;