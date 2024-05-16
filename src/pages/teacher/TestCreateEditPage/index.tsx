import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserData } from "../../../utils/TYPES";
import { onValue, ref } from "firebase/database";
import { auth, database } from "../../../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const TestCreateEditPage: React.FC = () => {
  const testCode = useParams().testCode as string;
  const [testData, setTestData] = useState<UserData["tests"][string]>(
    {} as UserData["tests"][string]
  );
  const navigate = useNavigate();

  useEffect(() => {
    //TODO: something wrong here
    console.log("here");

    const refUri = "users/" + "kjn".replace(/\./g, "?") + "/tests/" + testCode;
    console.log(refUri);
    const userTestsRef = ref(database, refUri);
    onValue(userTestsRef, (snapshot) => {
      const data = snapshot.val();
      setTestData(data || {});
    });
  }, []);

  return (
    <div>
      <h1>Testo redagavimas</h1>
      <p>Testo kodas: {testCode}</p>
      <pre>{JSON.stringify(testData, null, 2)}</pre>
    </div>
  );
};

export default TestCreateEditPage;
