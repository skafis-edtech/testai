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
import ButtonNumberInput from "../../../components/ButtonNumberInput";
import MakePublicButtons from "./MakePublicButtons";

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
      <h1 className="mt-2">Testo vertinimas</h1>
      <h3 className="text-center mb-4 text-2xl">{title}</h3>
      <h3 className="text-center mb-4 text-2xl">Testo kodas: {testCode}</h3>
      <p>Vertinimas išsisaugo automatiškai.</p>
      {testCode && <MakePublicButtons testCode={testCode} />}
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

interface SinglePersonGradingViewProps {
  gradingState: PrivateGrading["grades"][number];
  setGradingState: (gradingState: PrivateGrading["grades"][number]) => void;
  response: Execution[string]["responses"][number];
  questions: PrivateTestData["questions"];
}

const SinglePersonGradingView: React.FC<SinglePersonGradingViewProps> = ({
  gradingState,
  setGradingState,
  response,
  questions,
}) => {
  const updateGradedResponses = (
    number: string,
    points: number | undefined
  ) => {
    const existingResponse = gradingState.gradedResponses?.find(
      (gradedResponse) => gradedResponse.number === number
    );

    const updatedGradedResponses = existingResponse
      ? gradingState.gradedResponses.map((gradedResponse) =>
          gradedResponse.number === number
            ? { ...gradedResponse, points: points !== undefined ? points : 0 }
            : gradedResponse
        )
      : [
          ...(gradingState.gradedResponses || []),
          {
            number,
            answer:
              response.answers?.find((answer) => answer.number === number)
                ?.answer || "",
            correctAnswer:
              questions.find((q) => q.number === number)?.correctAnswer || "",
            points: points !== undefined ? points : 0,
            outOf: questions.find((q) => q.number === number)?.points || 0,
            isAdditional:
              questions.find((q) => q.number === number)?.isAdditional || false,
          },
        ];

    setGradingState({
      ...gradingState,
      student: response.studentId,
      points: updatedGradedResponses.reduce(
        (acc, curr) => acc + (!curr.isAdditional ? curr.points : 0),
        0
      ),
      outOf: updatedGradedResponses.reduce(
        (acc, curr) => acc + (!curr.isAdditional ? curr.outOf : 0),
        0
      ),
      additionalPoints: updatedGradedResponses.reduce(
        (acc, curr) => acc + (curr.isAdditional ? curr.points : 0),
        0
      ),
      outOfAdditional: updatedGradedResponses.reduce(
        (acc, curr) => acc + (curr.isAdditional ? curr.outOf : 0),
        0
      ),
      grade: (
        (updatedGradedResponses.reduce(
          (acc, curr) => acc + (!curr.isAdditional ? curr.points : 0),
          0
        ) *
          8) /
          updatedGradedResponses.reduce(
            (acc, curr) => acc + (!curr.isAdditional ? curr.outOf : 0),
            0
          ) +
        2
      ).toFixed(2) as unknown as number,
      gradedResponses: updatedGradedResponses,
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {questions?.map((question, index) => (
          <SingleAnswerGradingCard
            key={index}
            number={question.number}
            question={question.question}
            isAdditional={question.isAdditional}
            answer={
              response?.answers?.find(
                (answer) => answer.number === question.number
              )?.answer || ""
            }
            correctAnswer={question.correctAnswer}
            maxPoints={question.points}
            points={
              gradingState?.gradedResponses?.find(
                (gradedResponse) => gradedResponse.number === question.number
              )?.points
            }
            setPoints={(points) =>
              updateGradedResponses(question.number, points)
            }
          />
        ))}
      </div>
      <div className="my-8">
        <h3 className="text-2xl text-center">
          Surinkti taškai: {gradingState.points} iš {gradingState.outOf}
        </h3>
        <h3 className="text-2xl text-center">Pažymys: {gradingState.grade}</h3>
        <p>Tiesinė vertinimo sistema: 0 taškų - 2, visi taškai - 10.</p>
        <h3 className="text-2xl text-center my-4">
          Papildomų užduočių taškai: {gradingState.additionalPoints} iš{" "}
          {gradingState.outOfAdditional}
        </h3>
      </div>
      <h3>Komentaras mokiniui</h3>
      <input
        type="text"
        value={gradingState.teacherComment}
        onChange={(e) =>
          setGradingState({
            ...gradingState,
            teacherComment: e.target.value,
          })
        }
        placeholder={`Jūsų komentaras mokiniui su ID "${response?.studentId}"...`}
      />
    </div>
  );
};

interface SingleAnswerGradingCardProps {
  number: string;
  question: string;
  isAdditional: boolean;
  answer: string;
  correctAnswer: string;
  maxPoints: number;
  setPoints: (points: number | undefined) => void;
  points: number | undefined;
}

const SingleAnswerGradingCard: React.FC<SingleAnswerGradingCardProps> = ({
  number,
  question,
  isAdditional,
  answer,
  correctAnswer,
  maxPoints,
  setPoints,
  points,
}) => {
  return (
    <div className="bg-gray-200 p-5 rounded-lg my-1 w-full shadow-md text-center">
      <div className="mb-5">
        {number} {isAdditional ? "* (papildoma)" : ""} {question}
      </div>
      <h3 className="text-2xl">Mokinio atsakymas: </h3>
      <div className="text-xl mb-5">{answer}</div>
      <div className="text-2xl">Teisingas atsakymas:</div>
      <div className="text-xl mb-5">{correctAnswer}</div>
      <ButtonNumberInput
        min={0}
        max={maxPoints}
        value={points}
        setValue={setPoints}
      />
    </div>
  );
};

export default GradingPage;
