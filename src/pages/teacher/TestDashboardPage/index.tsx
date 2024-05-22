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
  const [testIsPublic, setTestIsPublic] = useState<boolean>(false);
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
    onValue(
      ref(
        database,
        "/users/" +
          currentUser?.email?.replace(/\./g, "?") +
          "/tests/" +
          testCode +
          "/test/isTestAccessible"
      ),
      (snapshot) => {
        setTestIsPublic(snapshot.val() || false);
      }
    );
  }, []);

  return (
    <div className="view-page-container">
      <div className="flex">
        <div className="w-3/12">
          <button className="max-w-96" onClick={() => navigate("/dashboard")}>
            Grįžti į mokytojo aplinkos pradinį puslapį
          </button>
        </div>
        <div className="w-6/12">
          <h1>Testo valdymas</h1>
          <h3 className="text-center text-[25px]">{testTitle}</h3>
          <h3 className="text-center">Testo kodas: {testCode}</h3>
          {testIsPublic ? (
            <h2 className="text-center">Testas paviešintas</h2>
          ) : (
            <h2 className="text-center" style={{ color: "green" }}>
              Testas privatus
            </h2>
          )}
        </div>
        <div className="w-3/12">
          <div className=" m-auto">
            <button
              className=" bg-amber-500 hover:bg-amber-700 px-2 py-1 text-sm"
              onClick={() => navigate(`/test/${testCode}/mokytojas`)}
            >
              Spręsti testą (kaip mokiniui su ID "mokytojas")
            </button>
            <button
              className=" bg-teal-600 hover:bg-teal-800"
              onClick={() => navigate(`/grading/${testCode}`)}
            >
              Vertinti mokinių pateiktus atsakymus
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl my-4">
          "Nelegalūs" išėjimai iš viso ekrano rėžimo
        </h3>
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
                  <tr key={index}>
                    {item.studentId !== "testas paviešintas" && (
                      <>
                        <td>{item?.studentId}</td>
                        <td>
                          {new Date(item?.timestamp).toLocaleString("lt")}
                        </td>
                      </>
                    )}
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-xl mb-4">Pateikti sprendimai / atsakymai</h3>
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
                <tr key={index}>
                  {response.studentId !== "testas paviešintas" && (
                    <>
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
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-xl mb-4">Grįžtamasis ryšys</h3>
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
                <tr key={index}>
                  {item.studentId !== "testas paviešintas" && (
                    <>
                      <td>{item.studentId}</td>
                      <td>{item.feedback}</td>
                      <td>{new Date(item?.timestamp).toLocaleString("lt")}</td>
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <button className="max-w-96" onClick={() => navigate("/dashboard")}>
        Grįžti į mokytojo aplinkos pradinį puslapį
      </button>
    </div>
  );
};

export default TestDashboardPage;
