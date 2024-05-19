import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserData } from "../../../utils/TYPES";
import { get, onValue, ref, set } from "firebase/database";
import { database } from "../../../services/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import "./index.css";

const TestCreateEditPage: React.FC = () => {
  const { testCode } = useParams();
  const navigate = useNavigate();
  const [testData, setTestData] = useState<UserData["tests"][string]>(
    {} as UserData["tests"][string]
  );
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [soonDeleted, setSoonDeleted] = useState<number>(-1);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const updatePublishedTest = () => {
    const test = testData;
    const filteredTestInfo = {
      writerEmail: currentUser?.email,
      description: test.test.description || "",
      title: test.test.title || "???",
      questions: test.test.questions.map((question) => ({
        isAdditional: question.isAdditional,
        number: question.number || "???",
        points: question.points,
        question: question.question || "",
      })),
      specialSymbols: test.test.specialSymbols || "",
    };

    const accessibleTestsRef = ref(database, `accessibleTests/${testCode}`);

    set(accessibleTestsRef, filteredTestInfo).catch((error) => {
      alert("Klaida išsaugant testo duomenis viešai");
      console.error("Error saving test data public: ", error);
    });
  };

  useEffect(() => {
    if (!currentUser) return;

    const testRef = ref(
      database,
      "users/" + currentUser?.email?.replace(/\./g, "?") + "/tests/" + testCode
    );
    get(testRef).then((snapshot) => {
      const data = snapshot.val() || {};
      setTestData(data);
      setLoading(false);
    });
    onValue(testRef, (snapshot) => {
      const data = snapshot.val() || {};
      setIsPublished(data?.test?.isTestAccessible || false);
    });
  }, [currentUser, testCode]);

  useEffect(() => {
    if (loading || !currentUser) return;

    const testRef = ref(
      database,
      "users/" + currentUser?.email?.replace(/\./g, "?") + "/tests/" + testCode
    );

    set(testRef, { ...testData, lastModified: new Date().toISOString() }).catch(
      (error) => {
        alert("Klaida išsaugant testo duomenis");
        console.error("Error saving test data: ", error);
      }
    );

    if (testData?.test?.isTestAccessible) {
      updatePublishedTest();
    }
  }, [testData]);

  if (loading) {
    return <h1>Kraunasi...</h1>;
  }

  return (
    <div className="input-page-container">
      <h1>Testo redagavimas</h1>
      <p>Informacija išsisaugo automatiškai beredaguojant</p>
      {isPublished && (
        <h2>
          Testas paviešintas! Redagavimo sistema yra pilnai tam pritaikyta,
          tačiau pakeitimai vykdomi realiu laiku, todėl rizikuojate pakenkti
          šiuo metu testą atliekančių mokinių testo atlikimo sklandumui.
        </h2>
      )}
      <h3 className="text-center ">Testo kodas: {testCode}</h3>
      <h3 className="text-center ">Testo pavadinimas:</h3>
      <input
        type="text"
        name="title"
        value={testData?.test?.title || ""}
        onChange={(e) =>
          setTestData((prev) => ({
            ...prev,
            test: { ...prev.test, title: e.target.value },
          }))
        }
      />
      <h3 className="text-center ">Komentaras (žinutė mokiniams):</h3>
      <textarea
        name="description"
        value={testData?.test?.description || ""}
        onChange={(e) =>
          setTestData((prev) => ({
            ...prev,
            test: { ...prev.test, description: e.target.value },
          }))
        }
      ></textarea>
      <h3 className="text-center ">
        Specialūs simboliai mokiniams kopijavimui:
      </h3>
      <input
        type="text"
        name="specialSymbols"
        id="specialSymbols"
        value={testData?.test?.specialSymbols || ""}
        onChange={(e) =>
          setTestData((prev) => ({
            ...prev,
            test: { ...prev.test, specialSymbols: e.target.value },
          }))
        }
      />
      <h3 className="text-center ">Klausimai:</h3>

      <div id="qs">
        {testData?.test?.questions?.map((question, index) => (
          <div
            key={index}
            style={{
              backgroundColor: soonDeleted === index ? "red" : "transparent",
            }}
          >
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
              <textarea
                value={question.question}
                onChange={(e) => {
                  setTestData((prev) => {
                    const newQuestions = [...prev.test.questions];
                    newQuestions[index].question = e.target.value;
                    return {
                      ...prev,
                      test: { ...prev.test, questions: newQuestions },
                    };
                  });
                }}
                name="question"
                placeholder="Jei duodate užduotis ant popieriaus, palikite laukelį tuščią"
              ></textarea>
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
                placeholder="Nevertinama automatiškai, nematoma mokiniams, matoma tik Jums bevertinant"
              ></textarea>
            </div>
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
                      (Number(e.target.value) < 10 &&
                        Number(e.target.value) > 0) ||
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
                value={question.isAdditional ? "true" : "false"}
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
                className="remove-question-btn"
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
            <hr />
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          setTestData((prev) =>
            prev.test.questions
              ? {
                  ...prev,
                  test: {
                    ...prev.test,
                    questions: [
                      ...prev.test.questions,
                      {
                        number: prev.test.questions.length + 1 + ".",
                        question: "",
                        correctAnswer: "",
                        points: 1,
                        isAdditional: false,
                      },
                    ],
                  },
                }
              : {
                  ...prev,
                  test: {
                    ...prev.test,
                    questions: [
                      {
                        number: "",
                        question: "",
                        correctAnswer: "",
                        points: 1,
                        isAdditional: false,
                      },
                    ],
                  },
                }
          );
        }}
        style={{
          marginTop: "20px",
          backgroundColor: "green",
          maxWidth: "100%",
        }}
      >
        Pridėti klausimą
      </button>

      <button
        style={{
          marginTop: "50px",
          marginBottom: "50px",
          width: "400px",
        }}
        onClick={() => navigate(-1)}
      >
        Grįžti (viskas išsisaugoję automatiškai)
      </button>
    </div>
  );
};

export default TestCreateEditPage;
