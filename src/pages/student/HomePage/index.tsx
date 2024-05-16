import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const regex = /^[a-zA-Z]*$/;
  const [testCode, setTestCode] = useState<string>("");

  const [studentId, setStudentId] = useState<string>("");

  const gotoTest = (event: any) => {
    event.preventDefault();
    if (studentId === "" || testCode === "") {
      alert("Prašome įvesti ID ir testo kodą");
      return;
    }
    navigate(`/test/${testCode}/${studentId}`);
  };

  const gotoResults = (event: any) => {
    event.preventDefault();
    if (studentId === "" || testCode === "") {
      alert("Prašome įvesti ID ir testo kodą");
      return;
    }
    navigate(`/grade/${testCode}/${studentId}`);
  };

  return (
    <div className="input-page-container">
      <div className="test-starter-container">
        <h1>Skafis testavimo aplinka</h1>
        <h2>
          DĖMESIO! Ši Skafis versija nėra pastovi! Nelaikykite platformoje
          ilgalaikių duomenų.
        </h2>
        <p>Jūsų ID ir testo kodas skelbiami mokytojo</p>
        <form onSubmit={gotoTest}>
          <input
            type="text"
            name="studentId"
            placeholder="Įveskite savo ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <input
            type="text"
            name="testCode"
            placeholder="Įveskite testo kodą"
            value={testCode}
            onChange={(e) => {
              if (regex.test(e.target.value)) {
                setTestCode(e.target.value.toUpperCase());
              }
            }}
          />
          <button type="submit" className="important-button">
            Pradėti testą
          </button>
        </form>
        <button onClick={gotoResults}>Pasitikrinti įvertinimą</button>
      </div>
      <button className="gotoDashboard" onClick={() => navigate("/dashboard")}>
        Mokytojo aplinka
      </button>
    </div>
  );
};

export default HomePage;
