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
    <div className="input-page-container">
      <h1 className="text-3xl font-bold underline">Testo vertinimas</h1>
      <h3 className="text-center text-[25px]">Stereometrija</h3>
      <h3 className="text-center">Testo kodas: ABCD</h3>
      <p>
        Vertinimas išsisaugo automatiškai. Rezultatai yra privatūs, kol
        nepaviešinsite jų "Testo valdymas" puslapyje.
      </p>
      <button onClick={() => navigate(`/test-dashboard/${testCode}`)}>
        Grįžti į puslapį "Testo valdymas"
      </button>

      {/* <h1 className="text-2xl font-bold">responsesData</h1>
      <pre>{JSON.stringify(responsesData, null, 2)}</pre>
      <h1 className="text-2xl font-bold">questionsDataWithAnswers</h1>
      <pre>{JSON.stringify(questionsDataWithAnswers, null, 2)}</pre>
      <h1 className="text-2xl font-bold">privateGradeData</h1>
      <pre>{JSON.stringify(privateGradeData, null, 2)}</pre> */}
      {/* <button style={{ width: "200px" }} onClick={() => navigate(-1)}>
        &#10094; Previous
      </button>
      <button style={{ width: "200px" }} onClick={() => navigate(1)}>
        Next &#10095;
      </button> */}
      {privateGradeData?.grades?.map((grade, index) => (
        <div key={index}>
          {index !== 0 && (
            <>
              <div>
                Person {index} out of {privateGradeData?.grades?.length - 1}
              </div>
              <div>
                Student ID: {Object.values(responsesData)[index].studentId}
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
            </>
          )}
        </div>
      ))}
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
    const existingResponse = gradingState.gradedResponses.find(
      (gradedResponse) => gradedResponse.number === number
    );

    const updatedGradedResponses = existingResponse
      ? gradingState.gradedResponses.map((gradedResponse) =>
          gradedResponse.number === number
            ? { ...gradedResponse, points: points !== undefined ? points : 0 }
            : gradedResponse
        )
      : [
          ...gradingState.gradedResponses,
          {
            number,
            answer:
              response.answers.find((answer) => answer.number === number)
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
          setPoints={(points) => updateGradedResponses(question.number, points)}
        />
      ))}

      <div>Points: {gradingState.points}</div>
      <div>Out of: {gradingState.outOf}</div>
      <div>Grade: {gradingState.grade}</div>
      <br />
      <div>Additional Points: {gradingState.additionalPoints}</div>
      <div>Out of Additional: {gradingState.outOfAdditional}</div>
      <br />
      <h1>Teacher Comment</h1>
      <input
        type="text"
        value={gradingState.teacherComment}
        onChange={(e) =>
          setGradingState({
            ...gradingState,
            teacherComment: e.target.value,
          })
        }
        placeholder="Jūsų komentaras mokiniui..."
      />
      <h1>gradingState</h1>
      <pre>{JSON.stringify(gradingState, null, 2)}</pre>
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
    <div>
      <div>Number: {number}</div>
      <div>Question: {question}</div>
      <div>isAdditional: {isAdditional ? "Yes" : "No"}</div>
      <div>answer: {answer}</div>
      <div>correctAnswer: {correctAnswer}</div>
      <div>max points: {maxPoints}</div>
      <ButtonNumberInput
        min={0}
        max={maxPoints}
        value={points}
        setValue={setPoints}
      />
      <div>Points: {points}</div>
      <br />
    </div>
  );
};

export default GradingPage;
