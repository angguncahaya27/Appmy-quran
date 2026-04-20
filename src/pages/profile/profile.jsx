import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css"; // Pastikan nama file CSS-nya sesuai
import fotoProfil from "../../assets/foto.jpg"; 

const Profile = () => {
  const navigate = useNavigate();

  const user = {
    nama: "Anggun Cahaya Adinda",
    nim: "12450121421",
    foto: fotoProfil 
  };

  return (
    <div className="profile-bg">
      <div className="profile-card">
        {/* Foto Profil */}
        <img
          src={user.foto} 
          alt="Profile"
          className="profile-img"
          onError={(e) => { 
            e.target.src = "https://via.placeholder.com/140"; 
          }}
        />

        {/* Font Poppins khusus untuk Nama */}
        <h2 className="user-name">{user.nama}</h2>
        
        {/* NIM menggunakan font default (sans-serif) */}
        <p className="user-nim">NIM: {user.nim}</p>
        
        {/* Tombol Hijau Pesanan Dosen (Satu-satunya tombol kembali) */}
        <button className="btn-back-green" onClick={() => navigate("/")}>
          KEMBALI
        </button>
      </div>
    </div>
  );
}

export default Profile;