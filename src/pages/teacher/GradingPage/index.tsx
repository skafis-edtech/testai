import React, { useState, useEffect } from "react";
import {
  Execution,
  PrivateGrading,
  PrivateTestData,
} from "../../../utils/TYPES";
import { get, onValue, ref, set } from "firebase/database";
import { database } from "../../../services/firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const GradingPage: React.FC = () => {
  const { testCode } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [responsesData, setResponsesData] = useState<
    Execution[string]["responses"]
  >([]);

  const [questionsDataWithAnswers, setQuestionsDataWithAnswers] = useState<
    PrivateTestData["questions"]
  >([]);

  const [privateGradeData, setPrivateGradeData] = useState<PrivateGrading>();

  useEffect(() => {
    // Fetch responses data
    onValue(
      ref(database, "/execution/" + testCode + "/responses"),
      (snapshot) => {
        setResponsesData(snapshot.val() || []);
        const length = Object.keys(snapshot.val() || []).length;
        get(
          ref(
            database,
            "/users/" +
              currentUser?.email?.replace(/\./g, "?") +
              "/tests/" +
              testCode +
              "/grading"
          )
        ).then((snapshot) => {
          if (!snapshot.val() || !snapshot.exists()) {
            setPrivateGradeData({
              pointsToGradeStrategy: "2-LINEAR-10",
              isGradesAccessible: false,
              isShowOnlyGrade: false,
              grades: Array.from({ length }, () => ({
                additionalPoints: 0,
                grade: 0,
                gradedResponses: [
                  {
                    answer: "",
                    correctAnswer: "",
                    isAdditional: false,
                    number: "",
                    outOf: 0,
                    points: 0,
                  },
                ],
                outOf: 0,
                outOfAdditional: 0,
                points: 0,
                student: "",
                teacherComment: "",
              })),
            });
          }
        });
      }
    );
    // Fetch questions data
    onValue(
      ref(
        database,
        "/users/" +
          currentUser?.email?.replace(/\./g, "?") +
          "/tests/" +
          testCode +
          "/test/questions"
      ),
      (snapshot) => {
        setQuestionsDataWithAnswers(snapshot.val() || []);
      }
    );

    onValue(
      ref(
        database,
        "/users/" +
          currentUser?.email?.replace(/\./g, "?") +
          "/tests/" +
          testCode +
          "/grading"
      ),
      (snapshot) => {
        setPrivateGradeData(snapshot.val() || {});
      }
    );
  }, []);

  return (
    <div className="input-page-container">
      <h1 className="text-3xl font-bold underline">Testo vertinimas</h1>
      <h3 className="text-center text-[25px]">Stereometrija</h3>
      <h3 className="text-center">Testo kodas: ABCD</h3>

      <h1 className="text-2xl font-bold">responsesData</h1>
      <pre>{JSON.stringify(responsesData, null, 2)}</pre>
      <h1 className="text-2xl font-bold">questionsDataWithAnswers</h1>
      <pre>{JSON.stringify(questionsDataWithAnswers, null, 2)}</pre>
      <h1 className="text-2xl font-bold">privateGradeData</h1>
      <pre>{JSON.stringify(privateGradeData, null, 2)}</pre>
      {/* <button style={{ width: "200px" }} onClick={() => navigate(-1)}>
        &#10094; Previous
      </button>
      <button style={{ width: "200px" }} onClick={() => navigate(1)}>
        Next &#10095;
      </button> */}
      {privateGradeData?.grades?.map((grade, index) => (
        <SinglePersonGradingView
          key={index}
          gradingState={grade}
          setGradingState={(gradingState) =>
            set(
              ref(
                database,
                "/users/" +
                  currentUser?.email?.replace(/\./g, "?") +
                  "/tests/" +
                  testCode +
                  "/grading/"
              ),
              {
                ...privateGradeData,
                grades: [
                  ...privateGradeData.grades.slice(0, index),
                  gradingState,
                  ...privateGradeData.grades.slice(index + 1),
                ],
              }
            )
          }
        />
      ))}
    </div>
  );
};

interface SinglePersonGradingViewProps {
  gradingState: PrivateGrading["grades"][number];
  setGradingState: (gradingState: PrivateGrading["grades"][number]) => void;
}

const SinglePersonGradingView: React.FC<SinglePersonGradingViewProps> = ({
  gradingState,
  setGradingState,
}) => {
  return (
    <div>
      <h1>SinglePersonGradingView</h1>
      <pre>{JSON.stringify(gradingState, null, 2)}</pre>
      <input
        type="text"
        value={gradingState.additionalPoints}
        onChange={(e) =>
          setGradingState({
            ...gradingState,
            additionalPoints: Number(e.target.value),
          })
        }
        placeholder="additionalPoints"
      />
    </div>
  );
};

export default GradingPage;
