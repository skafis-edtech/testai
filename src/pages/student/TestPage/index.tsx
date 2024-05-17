import { useParams } from "react-router-dom";
import { AccessibleTest } from "../../../utils/TYPES";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../../services/firebaseConfig";

const TestPage: React.FC = () => {
  const { testCode /*, studentId */ } = useParams();
  const [testData, setTestData] = useState<AccessibleTest>();

  useEffect(() => {
    onValue(ref(database, "/accessibleTests/" + testCode), (snapshot) => {
      setTestData(snapshot.val() || {});
    });
  }, []);

  return (
    <div className="input-page-container no-top-padding">
      <h1>{testData?.title}</h1>
      <h2>{testData?.description}</h2>
      <p>Simboliai kopijavimui:</p>
      <h1>{testData?.specialSymbols}</h1>
      {testData?.questions?.map((q, index) => (
        <div key={index}>
          <label>{`${q.number} ${q.isAdditional ? "(papildoma)" : ""} ${
            q.question
          } (${q.points} t.)`}</label>
          {q.points > 1 ? (
            <textarea name="answer1"></textarea>
          ) : (
            <input type="text" name="answer1" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TestPage;
