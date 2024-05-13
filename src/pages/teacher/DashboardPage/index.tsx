import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../../../services/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

interface Tests {
  [key: string]: {
    lastModified: string;
    test: {
      title: string;
      description: string;
      specialSymbols: string;
      questions: {
        number: string;
        question: string;
        correctAnswer: string;
        points: number;
        isAdditional: boolean;
      }[];
      isTestAccessible: boolean;
    };
    grading: {
      pointsToGradeStrategy: string;
      grades: {
        student: string;
        grade: number;
        points: number;
        outOf: number;
        gradedResponses: {
          number: string;
          answer: string;
          correctAnswer: string;
          points: number;
          outOf: number;
          isAdditional: boolean;
        }[];
        additionalPoints: number;
        outOfAdditional: number;
      }[];
      isGradesAccessible: boolean;
      isShowOnlyGrade: boolean;
    };
  };
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [testList, setTestList] = useState<Tests>({});

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userTestsRef = ref(
        database,
        "users/" + user.email?.replace(/\./g, "?") + "/tests"
      );
      onValue(userTestsRef, (snapshot) => {
        const data = snapshot.val();
        setTestList(data);
      });
    } else {
      navigate("/login");
    }
  });

  return (
    <div>
      <h1>Dashboard Page</h1>
      <button className="logout-btn" onClick={() => navigate("/logout")}>
        Atsijungti
      </button>
      <div className="dashboard-test-list">
        {testList &&
          Object.keys(testList).map((key) => {
            return (
              <div className="test-list-item" key={key}>
                <button onClick={() => navigate(`/test-dashboard/${key}`)}>
                  "{testList[key].test.title}" (kodas: {key})
                </button>
                {testList[key].test.isTestAccessible ? (
                  <>
                    <p>Viešas</p>
                    <button onClick={() => alert("This will make it private")}>
                      Užprivatinti
                    </button>
                  </>
                ) : (
                  <>
                    <p>Privatus</p>
                    <button onClick={() => alert("This will make it public")}>
                      Viešinti
                    </button>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DashboardPage;
