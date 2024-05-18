import { useNavigate, useParams } from "react-router-dom";
import { Execution } from "../../../utils/TYPES";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../../services/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";

const TestDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { testCode } = useParams();
  const [executionData, setExecutionData] = useState<Execution[string]>();
  const [testTitle, setTestTitle] = useState<string>("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const executionRef = ref(database, "/execution/" + testCode);
    onValue(executionRef, (snapshot) => {
      setExecutionData(snapshot.val() || {});
    });
    onValue(
      ref(
        database,
        "/users/" +
          currentUser?.email?.replace(/\./g, "?") +
          "/tests/" +
          testCode +
          "/test/title"
      ),
      (snapshot) => {
        setTestTitle(snapshot.val() || "");
      }
    );
  }, []);

  return (
    <div className="input-page-container no-top-padding">
      <h1>Testo valdymas</h1>
      <h3 className="text-in-the-center bigger">{testTitle}</h3>
      <h3 className="text-in-the-center">Testo kodas: {testCode}</h3>

      <button onClick={() => navigate(`/test/${testCode}/mokytojas`)}>
        Spręsti testą (kaip mokiniui su ID "mokytojas")
      </button>

      <button onClick={() => navigate(`/test-create-edit/${testCode}`)}>
        Redaguoti testą
      </button>
      <button onClick={() => navigate("/dashboard")}>
        Grįžti į mokytojo aplinkos pradinį puslapį
      </button>
      <div>
        <h3>"Nelegalūs" išėjimai iš viso ekrano rėžimo</h3>
        <table>
          <thead>
            <tr>
              <th>Mokinio ID</th>
              <th>Laikas</th>
            </tr>
          </thead>
          <tbody>
            {executionData?.fullscreenExits &&
              Object.values(executionData?.fullscreenExits).map(
                (item, index) => (
                  <>
                    {item.studentId !== "testas paviešintas" && (
                      <tr key={index}>
                        <td>{item?.studentId}</td>
                        <td>
                          {new Date(item?.timestamp).toLocaleString("lt")}
                        </td>
                      </tr>
                    )}
                  </>
                )
              )}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Pateikti sprendimai / atsakymai</h3>
        <table>
          <thead>
            <tr>
              <th>Mokinio ID</th>
              <th>Atsakymai</th>
              <th>Laikas</th>
            </tr>
          </thead>
          <tbody>
            {executionData?.responses &&
              Object.values(executionData?.responses).map((response, index) => (
                <>
                  {response.studentId !== "testas paviešintas" && (
                    <tr key={index}>
                      <td>{response?.studentId}</td>
                      <td>
                        <table>
                          <thead>
                            <tr>
                              <th>Užd.</th>
                              <th>Atsakymas</th>
                            </tr>
                          </thead>
                          <tbody>
                            {response?.answers?.map((answer, i) => (
                              <tr key={i}>
                                <td>{answer.number}</td>
                                <td>{answer.answer}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                      <td>
                        {new Date(response?.timestamp).toLocaleString("lt")}
                      </td>
                    </tr>
                  )}
                </>
              ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Grįžtamasis ryšys</h3>
        <table>
          <thead>
            <tr>
              <th>Mokinio ID</th>
              <th>Grįžtamasis ryšys</th>
              <th>Laikas</th>
            </tr>
          </thead>
          <tbody>
            {executionData?.feedback &&
              Object.values(executionData?.feedback).map((item, index) => (
                <>
                  {item.studentId !== "testas paviešintas" && (
                    <tr key={index}>
                      <td>{item.studentId}</td>
                      <td>{item.feedback}</td>
                      <td>{new Date(item?.timestamp).toLocaleString("lt")}</td>
                    </tr>
                  )}
                </>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestDashboardPage;
