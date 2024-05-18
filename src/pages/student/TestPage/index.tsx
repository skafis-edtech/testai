import { useNavigate, useParams } from "react-router-dom";
import { AccessibleTest } from "../../../utils/TYPES";
import { useEffect, useState } from "react";
import { onValue, push, ref } from "firebase/database";
import { database } from "../../../services/firebaseConfig";
import usePersistentState from "../../../hooks/usePersistentState";

const TestPage: React.FC = () => {
  const navigate = useNavigate();
  const { testCode, studentId } = useParams();
  const [testData, setTestData] = useState<AccessibleTest>();
  const [answers, setAnswers] = usePersistentState<
    { number: string; answer: string }[]
  >("answers", []);

  useEffect(() => {
    onValue(ref(database, "/accessibleTests/" + testCode), (snapshot) => {
      setTestData(snapshot.val() || {});
      setAnswers(
        snapshot
          .val()
          ?.questions?.map((q: any) => ({ number: q.number, ans: "" })) || []
      );
    });
  }, []);

  const turnIn = () => {
    if (confirm("Ar tikrai norite pateikti testą vertinimui?")) {
      const userResponse = {
        studentId,
        timestamp: new Date().toISOString(),
        answers: answers.map((a) => ({ number: a.number, answer: a.answer })),
      };

      const testRef = ref(database, "/execution/" + testCode + "/responses");
      push(testRef, userResponse).then(() => {
        setAnswers([]);
        alert("Testas sėkmingai pateiktas vertinimui!");
        navigate("/feedback/" + testCode + "/" + studentId);
      });
    }
  };

  return (
    <div className="input-page-container no-top-padding">
      <h1>{testData?.title}</h1>
      <p>
        Testo duomenys automatiškai išsisaugo kompiuterio atmintyje. Todėl
        nesijaudinkite, jei dings interneto ryšys ar atsiras kiti nesklandumai -
        grįžus rasite visus savo atsakymus niekur nepabėgusius :)) Paspaudus
        "Pateikti vertinimui" mygtuką, testo duomenys bus išsiųsti į serverį ir
        pasiekiami mokytojui, tuo tarpu kompiuteryje ištrinti. Pateikiant
        atsakymus antrą kartą jūsų ankstesni atsakymai nebus perrašyti.
      </p>
      <h2>{testData?.description}</h2>
      {testData?.specialSymbols && (
        <>
          <p>Simboliai kopijavimui:</p>
          <div style={{ display: "flex", height: "90px" }}>
            {testData?.specialSymbols?.split("").map((symbol, index) => (
              <CopyButton key={index} text={symbol} />
            ))}
          </div>
        </>
      )}
      {testData?.questions?.map((q, index) => (
        <div key={index} style={{ marginBottom: "40px" }}>
          <label>{`${q.number}${q.isAdditional ? "* (papildoma)" : " "} ${
            q.question
          } (${q.points} t.)`}</label>
          {q.points > 1 ? (
            <textarea
              value={answers.find((a) => a.number === q.number)?.answer}
              onChange={(e) =>
                setAnswers(
                  answers.map((a) =>
                    a.number === q.number
                      ? { number: a.number, answer: e.target.value }
                      : a
                  )
                )
              }
              name="answer"
            ></textarea>
          ) : (
            <input type="text" name="answer" />
          )}
        </div>
      ))}
      <button onClick={turnIn}>Pateikti vertinimui</button>
    </div>
  );
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button className="num-btn" onClick={copyToClipboard}>
        {text}
      </button>
      {copied ? <em style={{ fontSize: "10px" }}>Nukopijuota!</em> : ""}
    </div>
  );
}

export default TestPage;
