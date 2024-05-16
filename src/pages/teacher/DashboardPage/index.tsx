import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../../../services/firebaseConfig";
import { onValue, ref, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { UserData } from "../../../utils/TYPES";
import "./index.css";
import { useAuth } from "../../../context/AuthContext";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [testList, setTestList] = useState<UserData["tests"]>({});
  const [sortedKeys, setSortedKeys] = useState<string[]>([]);
  const [usedTestCodes, setUsedTestCodes] = useState<string[]>([]);
  const { currentUser } = useAuth();

  const regex = /^[a-zA-Z]*$/;
  const [newTestCode, setNewTestCode] = useState<string>("");

  useEffect(() => {
    if (testList) {
      const sortedList = Object.keys(testList).sort(
        (a, b) =>
          new Date(testList[b].lastModified).getTime() -
          new Date(testList[a].lastModified).getTime()
      );
      setSortedKeys(sortedList);
    }
  }, [testList]);

  useEffect(() => {
    const userTestsRef = ref(
      database,
      "users/" + currentUser?.email?.replace(/\./g, "?") + "/tests"
    );
    onValue(userTestsRef, (snapshot) => {
      const data = snapshot.val();
      setTestList(data || {});
    });

    const testCodesInUseRef = ref(database, "testCodesInUse");
    onValue(testCodesInUseRef, (snapshot) => {
      const data = snapshot.val();
      setUsedTestCodes(data || []);
    });
  }, [navigate]);

  const makeTestPublic = (testId: string) => {
    alert("This will make it public" + testId);
  };

  const makeTestPrivate = (testId: string) => {
    alert("This will make it private" + testId);
  };

  const createNewTest = (testId: string) => {
    if (testId === "") {
      alert("Įveskite testo kodą");
      return;
    }
    if (usedTestCodes.includes(testId)) {
      alert("Toks testo kodas jau egzistuoja");
      return;
    }
    const newTestRef = ref(
      database,
      "users/" + currentUser?.email?.replace(/\./g, "?") + "/tests/" + testId
    );
    set(newTestRef, {
      lastModified: new Date().toISOString(),
      test: {
        title: "Naujas testas",
        isTestAccessible: false,
        questions: {},
      },
    })
      .then(() => {
        set(ref(database, "testCodesInUse"), [...usedTestCodes, testId])
          .then(() => navigate(`/test-create-edit/${testId}`))
          .catch((error) => {
            console.error("Error updating testCodesInUse: ", error);
            alert("Klaida: " + error.message);
          });
      })
      .catch((error) => {
        console.error("Error creating new test: ", error);
        alert("Klaida: " + error.message);
      });
  };

  return (
    <div>
      <h1>Mokytojo aplinka</h1>
      <div className="email-div">{currentUser?.email || "Kraunasi..."}</div>
      <button className="logout-btn" onClick={() => navigate("/logout")}>
        Atsijungti
      </button>
      <div className="dashboard-test-list">
        <div className="test-list-item new-test-item">
          <div className="test-title">Kurti naują testą</div>
          <input
            type="text"
            placeholder="Įveskite naujo testo kodą"
            value={newTestCode}
            onChange={(e) => {
              if (regex.test(e.target.value)) {
                setNewTestCode(e.target.value.toUpperCase());
              }
            }}
          />
          <button onClick={() => createNewTest(newTestCode)}>
            Kurti testą
          </button>
        </div>
        {testList &&
          sortedKeys.map((key) => (
            <div className="test-list-item" key={key}>
              <button
                className="goto-test-button"
                onClick={() => navigate(`/test-dashboard/${key}`)}
              >
                <div className="test-title">{testList[key].test.title}</div>
                <div className="test-key">Kodas: {key}</div>
                <div className="test-date">
                  Keista: {testList[key].lastModified.slice(0, 10)}
                </div>
              </button>
              {testList[key].test.isTestAccessible ? (
                <div className="status-container">
                  <div className="status-public">VIEŠAS</div>
                  <button
                    className="make-private-button"
                    onClick={() => makeTestPrivate(key)}
                  >
                    Užprivatinti
                  </button>
                </div>
              ) : (
                <div className="status-container">
                  <div className="status-private">PRIVATUS</div>
                  <button
                    className="make-public-button"
                    onClick={() => makeTestPublic(key)}
                  >
                    Viešinti
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default DashboardPage;
