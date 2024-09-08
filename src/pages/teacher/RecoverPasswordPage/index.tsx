import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const RecoverPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const sendEmail = (e: any) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert(
          "Slaptažodžio atkūrimo laiškas sėkmingai išsiųstas iš noreply@bankas-skafis.firebaseapp.com. Patikrinkite savo el. paštą."
        );
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        alert(
          "Laiškas išsiųstas nesėkmingai. Prašome patikrinti suvestą el. pašto adresą ir bandyti iš naujo."
        );
      });
  };
  return (
    <div className="centered-input-page-container">
      <h1>Slaptažodžio atkūrimas</h1>
      <form className="mb-4" onSubmit={sendEmail}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          pattern="[^?]*"
          placeholder="Įveskite el. paštą"
          required
        />
        <button className="simple-submit" type="submit">
          Siųsti slaptažodžio atkūrimo laišką
        </button>
      </form>
      <p>
        <a href="/login">Grįžti į prisijungimo puslapį</a>
      </p>
    </div>
  );
};

export default RecoverPasswordPage;
