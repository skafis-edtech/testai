import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const loginUser = async (event: any) => {
    event.preventDefault();
    if (email === "" || password === "") {
      alert("Prašome užpildyti visus laukus");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error logging in: ", error);
      alert("Klaida: " + error.message);
    }
  };

  return (
    <div className="centered-input-page-container">
      <h1>Mokytojo prisijungimas</h1>
      <form className="mb-4" onSubmit={loginUser}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Įveskite el. paštą"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Įveskite slaptažodį"
          required
        />
        <button className="simple-submit" type="submit">
          Prisijungti
        </button>
      </form>
      <p>
        Neturite paskyros?{" "}
        <a href="https://bankas.skafis.lt/register?redirect=https://testai.skafis.lt/login">
          Registruotis
        </a>
      </p>
      <p>
        Pamiršote slaptažodį? <a href="/recover-password">Atkurti</a>
      </p>
    </div>
  );
};

export default LoginPage;
