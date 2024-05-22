import { UserData } from "../../../utils/TYPES";
import ImageUploadTextarea from "./ImageUploadTextarea";

interface QuestionProps {
  question: UserData["tests"][string]["test"]["questions"][number];
  index: number;
  setTestData: React.Dispatch<React.SetStateAction<UserData["tests"][string]>>;
  testData: UserData["tests"][string];
  soonDeleted: number;
  setSoonDeleted: React.Dispatch<React.SetStateAction<number>>;
  testCode: string | undefined;
}

const Question: React.FC<QuestionProps> = ({
  question,
  index,
  setTestData,
  testData,
  soonDeleted,
  setSoonDeleted,
  testCode,
}) => {
  return (
    <div
      className={`flex flex-col lg:flex-row gap-8 p-5  ${
        soonDeleted === index ? "bg-red-600" : "bg-gray-100"
      }  p-5 rounded-lg mb-12 mt-8 w-full shadow-md text-left`}
    >
      <div className="w-full lg:w-8/12">
        <div>
          <label>Klausimo numeris:</label>
          <br />
          <input
            style={{ width: "80px" }}
            value={question.number}
            onChange={(e) => {
              setTestData((prev) => {
                const newQuestions = [...prev.test.questions];
                newQuestions[index].number = e.target.value;
                return {
                  ...prev,
                  test: { ...prev.test, questions: newQuestions },
                };
              });
            }}
            type="text"
            name="number"
          />
        </div>
        <div>
          <label>Klausimas:</label>
          <br />
          <ImageUploadTextarea
            textareaContent={question.question}
            setTextareaContent={(text: string) => {
              setTestData((prev) => {
                const newQuestions = [...prev.test.questions];
                newQuestions[index].question = text;
                return {
                  ...prev,
                  test: { ...prev.test, questions: newQuestions },
                };
              });
            }}
            imageFilenameInQ={question.imageFilename || null}
            setImageFilenameInQ={(imageFilename: string) => {
              setTestData((prev) => {
                const newQuestions = [...prev.test.questions];
                newQuestions[index].imageFilename = imageFilename;
                return {
                  ...prev,
                  test: { ...prev.test, questions: newQuestions },
                };
              });
            }}
            testCode={testCode}
          />
        </div>
        <div>
          <label>Teisingas atsakymas / sprendimas:</label>
          <br />
          <textarea
            value={question.correctAnswer}
            onChange={(e) => {
              setTestData((prev) => {
                const newQuestions = [...prev.test.questions];
                newQuestions[index].correctAnswer = e.target.value;
                return {
                  ...prev,
                  test: { ...prev.test, questions: newQuestions },
                };
              });
            }}
            name="correctAnswer"
            placeholder="Nevertinama automatiškai, matoma Jums bevertinant bei mokiniams peržiūrint rezultatus..."
          ></textarea>
        </div>
      </div>
      <div className="w-full lg:w-4/12">
        <div>
          <label>Taškai:</label>
          <br />
          <span>
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className="num-btn"
                onClick={() => {
                  setTestData((prev) => {
                    const newQuestions = [...prev.test.questions];
                    newQuestions[index].points = num;
                    return {
                      ...prev,
                      test: { ...prev.test, questions: newQuestions },
                    };
                  });
                }}
              >
                {num}
              </button>
            ))}
            <input
              type="number"
              name="points"
              min="1"
              max="9"
              value={question.points}
              onChange={(e) => {
                if (
                  (Number(e.target.value) < 10 && Number(e.target.value) > 0) ||
                  e.target.value === ""
                ) {
                  setTestData((prev) => {
                    const newQuestions = [...prev.test.questions];
                    newQuestions[index].points = Number(e.target.value);
                    return {
                      ...prev,
                      test: { ...prev.test, questions: newQuestions },
                    };
                  });
                }
              }}
            />
          </span>
        </div>
        <div>
          <label>Užduotis yra papildoma:</label>
          <br />
          <input
            type="checkbox"
            checked={question.isAdditional ? true : false}
            onChange={(e) => {
              setTestData((prev) => {
                const newQuestions = [...prev.test.questions];
                newQuestions[index].isAdditional = e.target.checked;
                return {
                  ...prev,
                  test: { ...prev.test, questions: newQuestions },
                };
              });
            }}
            name="isAdditional"
          />
        </div>
        {testData.test.questions.length > 1 && (
          <button
            className="remove-question-btn mt-11"
            onClick={() => {
              setTestData((prev) => {
                const newQuestions = [...prev.test.questions];
                newQuestions.splice(index, 1);
                return {
                  ...prev,
                  test: { ...prev.test, questions: newQuestions },
                };
              });
              setSoonDeleted(-1);
            }}
            onMouseEnter={() => setSoonDeleted(index)}
            onMouseLeave={() => setSoonDeleted(-1)}
          >
            Pašalinti klausimą
          </button>
        )}
      </div>
    </div>
  );
};

export default Question;
