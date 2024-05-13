import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     navigate("/dashboard");
  //   }
  // });

  const loginUser = (event: any) => {
    event.preventDefault();
    if (email === "" || password === "") {
      alert("Prašome užpildyti visus laukus");
      return;
    }
    // try {
    //   const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //   alert("Sėkmingai prisijungta!");
    // } catch (error) {
    //   console.error("Error logging in: ", error);
    //   alert("Klaida: " + error.message);
    // }

    navigate("/dashboard");
  };

  return (
    <div className="narrow-input-page-container">
      <h1>Mokytojo prisijungimas</h1>
      <form onSubmit={loginUser}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Įveskite el. paštą"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Įveskite slaptažodį"
        />
        <button className="simple-submit" type="submit">
          Prisijungti
        </button>
      </form>
      <p>
        Neturite paskyros? <a href="/register">Registruotis</a>
      </p>
      <p>
        Pamiršote slaptažodį? <a href="/recover-password">Atkurti</a>
      </p>
    </div>
  );
};

export default LoginPage;
