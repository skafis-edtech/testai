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

  const convertObjectToArray = (obj: any): any => {
    return obj ? Object.entries(obj).map(([key, value]) => value) : [];
  };

  const feedbackArray: Execution[string]["feedback"] = convertObjectToArray(
    executionData?.feedback
  );
  const fullscreenExitsArray: Execution[string]["fullscreenExits"] =
    convertObjectToArray(executionData?.fullscreenExits);
  const responsesArray: Execution[string]["responses"] = convertObjectToArray(
    executionData?.responses
  );

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
        <h3>Feedback</h3>
        {feedbackArray.map((item, index) => (
          <div
            key={index}
            style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
          >
            <p>
              <strong>Feedback:</strong> {item.feedback}
            </p>
            <p>
              <strong>Student ID:</strong> {item.studentId}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(item?.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div>
        <h3>Fullscreen Exits</h3>
        {fullscreenExitsArray.map((item, index) => (
          <div
            key={index}
            style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
          >
            <p>
              <strong>Student ID:</strong> {item?.studentId}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(item?.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div>
        <h3>Responses</h3>
        {responsesArray.map((response, index) => (
          <div
            key={index}
            style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
          >
            <p>
              <strong>Student ID:</strong> {response?.studentId}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(response?.timestamp).toLocaleString()}
            </p>
            <div>
              <h4>Answers</h4>
              {response?.answers?.map((answer, i) => (
                <div key={i} style={{ paddingLeft: "10px" }}>
                  <p>
                    <strong>Number:</strong> {answer.number}
                  </p>
                  <p>
                    <strong>Answer:</strong> {answer.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestDashboardPage;
