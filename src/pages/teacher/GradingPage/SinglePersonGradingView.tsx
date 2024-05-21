import {
  Execution,
  PrivateGrading,
  PrivateTestData,
} from "../../../utils/TYPES";
import SingleAnswerGradingCard from "./SingleAnswerGradingCard";

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
      <div className="flex flex-wrap gap-4 justify-center">
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

export default SinglePersonGradingView;
