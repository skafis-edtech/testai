import { push, ref } from "firebase/database";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../../../services/firebaseConfig";

const FeedbackPage: React.FC = () => {
  const { testCode, studentId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<string>("");
  return (
    <div className="input-page-container no-top-padding">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const userFeedback = {
            studentId,
            timestamp: new Date().toISOString(),
            feedback,
          };

          const feedbackRef = ref(
            database,
            "execution/" + testCode + "/feedback"
          );

          push(feedbackRef, userFeedback)
            .then(() => {
              alert("Atsiliepimas sėkmingai pateiktas mokytojui!");
              navigate("/");
            })
            .catch((e) => {
              alert("Įvyko klaida pateikiant atsiliepimą: " + e.message);
              console.error("Error submitting feedback: ", e);
            });
        }}
      >
        <h1>Grįžtamasis ryšys (mokytojui)</h1>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Įveskite savo pastabas, klausimus, pageidavimus mokytojui..."
          style={{ width: "100%", height: "200px", marginTop: "20px" }}
        ></textarea>
        <button type="submit" style={{ marginTop: "10px" }}>
          Pateikti
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;
