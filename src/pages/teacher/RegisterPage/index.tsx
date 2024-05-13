import { useState } from "react";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [terms, setTerms] = useState<boolean>(false);

  const registerUser = (event: any) => {
    event.preventDefault();
    if (email === "" || password === "" || confirmPassword === "") {
      alert("Prašome užpildyti visus laukus");
      return;
    }
    if (password !== confirmPassword) {
      alert("Slaptažodžiai nesutampa");
      return;
    }
    if (!terms) {
      alert("Prašome sutikti su taisyklėmis");
      return;
    }
    // try {
    //   const userCredential = await createUserWithEmailAndPassword(
    //     auth,
    //     email,
    //     password
    //   );
    //   alert("Sėkmingai užregistruota!");
    // } catch (error) {
    //   console.error("Error registering user: ", error);
    //   alert("Klaida: " + error.message);
    // }
    alert("Sėkmingai užregistruota!");
  };

  return (
    <div className="narrow-input-page-container">
      <form onSubmit={registerUser}>
        <h1>Mokytojo registracija</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          pattern="[^?]*"
          placeholder="Įveskite el. paštą"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Įveskite slaptažodį"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Pakartokite slaptažodį"
        />
        <input
          type="checkbox"
          value={terms.toString()}
          onChange={(e) => setTerms(e.target.checked)}
        />
        <label>
          Sutinku su{" "}
          <a href="/terms" target="_blank">
            taisyklėmis
          </a>
        </label>
        <button type="submit">Registruotis</button>{" "}
      </form>
      <p>
        Jau turite paskyrą? <a href="/login">Prisijungti</a>
      </p>
    </div>
  );
};

export default RegisterPage;
