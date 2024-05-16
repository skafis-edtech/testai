import { useNavigate, useParams } from "react-router-dom";

const TestDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { testCode } = useParams();
  return (
    <div>
      <h1>Testo valdymas</h1>
      <button onClick={() => navigate(`/test-create-edit/${testCode}`)}>
        Redaguoti testą
      </button>
      <button onClick={() => navigate("/dashboard")}>
        Grįžti į mokytojo aplinkos pradinį puslapį
      </button>
    </div>
  );
};

export default TestDashboardPage;
