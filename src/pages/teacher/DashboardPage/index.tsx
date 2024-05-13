import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../../services/firebaseConfig";
import { onValue, ref } from "firebase/database";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({});

  useEffect(() => {
    const dataRef = ref(database, "/");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      setData(data);
    });
  }, []);

  return (
    <div>
      <h1>Dashboard Page</h1>
      <button onClick={() => navigate("/logout")}>Atsijungti</button>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DashboardPage;
