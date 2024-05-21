import ButtonNumberInput from "../../../components/ButtonNumberInput";

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
    <div className="bg-gray-200 p-5 rounded-lg my-1 inline w-shadow-md text-center">
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

export default SingleAnswerGradingCard;
