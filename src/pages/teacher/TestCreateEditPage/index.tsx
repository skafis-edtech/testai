import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserData } from "../../../utils/TYPES";
import { get, ref, set } from "firebase/database";
import { database } from "../../../services/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";

const TestCreateEditPage: React.FC = () => {
  const { testCode } = useParams();
  const navigate = useNavigate();
  const [testData, setTestData] = useState<UserData["tests"][string]>(
    {} as UserData["tests"][string]
  );
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const testRef = ref(
      database,
      "users/" + currentUser?.email?.replace(/\./g, "?") + "/tests/" + testCode
    );
    get(testRef).then((snapshot) => {
      const data = snapshot.val() || {};
      setTestData(data);
      setLoading(false);
    });
  }, [currentUser, testCode]);

  useEffect(() => {
    if (loading || !currentUser) return;

    const testRef = ref(
      database,
      "users/" + currentUser?.email?.replace(/\./g, "?") + "/tests/" + testCode
    );

    set(testRef, { ...testData, lastModified: new Date().toISOString() }).catch(
      (error) => {
        alert("Klaida išsaugant testo duomenis");
        console.error("Error saving test data: ", error);
      }
    );
  }, [testData]);

  if (loading) {
    return <h1>Kraunasi...</h1>;
  }

  return (
    <div>
      <h1>Testo redagavimas</h1>
      <p>Informacija išsisaugo iškart beredaguojant</p>
      <h3 className="text-in-the-center">Testo kodas: {testCode}</h3>
      <h3 className="text-in-the-center">Testo pavadinimas:</h3>
      <input
        type="text"
        name="title"
        value={testData?.test?.title || ""}
        onChange={(e) =>
          setTestData((prev) => ({
            ...prev,
            test: { ...prev.test, title: e.target.value },
          }))
        }
      />
      <h3 className="text-in-the-center">Testo aprašymas:</h3>
      <textarea
        name="description"
        value={testData?.test?.description || ""}
        onChange={(e) =>
          setTestData((prev) => ({
            ...prev,
            test: { ...prev.test, description: e.target.value },
          }))
        }
      ></textarea>
      <h3 className="text-in-the-center">Specialūs simboliai:</h3>
      <input
        type="text"
        name="specialSymbols"
        value={testData?.test?.specialSymbols || ""}
        onChange={(e) =>
          setTestData((prev) => ({
            ...prev,
            test: { ...prev.test, specialSymbols: e.target.value },
          }))
        }
      />
      <h3 className="text-in-the-center">Klausimai:</h3>

      <button onClick={() => navigate(-1)}>Grįžti</button>
    </div>
  );
};

export default TestCreateEditPage;
