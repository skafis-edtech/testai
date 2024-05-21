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
import MakePublicButtons from "./MakePublicButtons";
import SinglePersonGradingView from "./SinglePersonGradingView";

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

  const [title, setTitle] = useState<string>("");

  const [privateGradeData, setPrivateGradeData] = useState<PrivateGrading>();

  useEffect(() => {
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
        setTitle(snapshot.val() || "");
      }
    );

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
                gradedResponses: [],
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
    <div className="view-page-container">
      <div className="flex">
        <div className="w-3/12">
          <button onClick={() => navigate(`/test-dashboard/${testCode}`)}>
            Grįžti į puslapį "Testo valdymas" (vertinimas išsaugotas
            automatiškai)
          </button>
        </div>
        <div className="w-6/12">
          <h1 className="mt-2">Testo vertinimas</h1>
          <h3 className="text-center mb-4 text-2xl">{title}</h3>
          <h3 className="text-center mb-4 text-2xl">Testo kodas: {testCode}</h3>
          <p>Vertinimas išsisaugo automatiškai.</p>
        </div>
        <div className="w-3/12">
          {testCode && <MakePublicButtons testCode={testCode} />}
        </div>
      </div>

      {privateGradeData?.grades?.map((grade, index) => (
        <div key={index}>
          {index !== 0 && (
            <div className="bg-gray-100 p-5 rounded-lg mb-20 mt-8 w-full shadow-md text-center">
              <div>
                <h3 className="text-2xl">
                  Mokinys {index} iš {privateGradeData?.grades?.length - 1}
                </h3>
                <h3 className="text-3xl my-8">
                  Mokinio ID: {Object.values(responsesData)[index]?.studentId}
                </h3>
              </div>
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
                response={Object.values(responsesData)[index]}
                questions={questionsDataWithAnswers}
              />
            </div>
          )}
        </div>
      ))}
      <button onClick={() => navigate(`/test-dashboard/${testCode}`)}>
        Grįžti į puslapį "Testo valdymas" (vertinimas išsaugotas automatiškai)
      </button>
    </div>
  );
};

export default GradingPage;
