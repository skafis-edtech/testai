import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserData } from "../../../utils/TYPES";
import { get, onValue, ref, set } from "firebase/database";
import { database } from "../../../services/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import "./index.css";
import Question from "./Question";

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
    <div className="view-page-container">
      <div className="flex">
        <div className="w-3/12">
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
        <div className="w-6/12">
          <h1>Testo redagavimas</h1>
          <p>Informacija išsisaugo automatiškai beredaguojant</p>
          {isPublished && (
            <h2>
              Testas paviešintas! Redagavimo sistema yra pilnai tam pritaikyta,
              tačiau pakeitimai vykdomi realiu laiku, todėl rizikuojate pakenkti
              šiuo metu testą atliekančių mokinių testo atlikimo sklandumui.
            </h2>
          )}
          <h3 className="text-center text-[25px]">Testo kodas: {testCode}</h3>
        </div>
        <div className="w-3/12"></div>
      </div>
      <h3 className="text-center text-[25px]">Testo pavadinimas:</h3>
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
      <h3 className="text-center text-[25px]">
        Komentaras (žinutė mokiniams):
      </h3>
      <textarea
        className="text-red-500"
        name="description"
        value={testData?.test?.description || ""}
        onChange={(e) =>
          setTestData((prev) => ({
            ...prev,
            test: { ...prev.test, description: e.target.value },
          }))
        }
      ></textarea>
      <h3 className="text-center text-[25px]">
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
      <h3 className="text-center text-[25px]">Klausimai:</h3>

      <div id="qs">
        {testData?.test?.questions?.map((question, index) => (
          <Question
            key={index}
            question={question}
            index={index}
            setTestData={setTestData}
            testData={testData}
            soonDeleted={soonDeleted}
            setSoonDeleted={setSoonDeleted}
          />
        ))}

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
      </div>
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
