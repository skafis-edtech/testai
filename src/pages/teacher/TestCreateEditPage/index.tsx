import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserData } from "../../../utils/TYPES";

const TestCreateEditPage: React.FC = () => {
  const testCode = useParams().testCode as string;
  const [testData, setTestData] = useState<UserData["tests"][string]>(
    {} as UserData["tests"][string]
  );

  useEffect(() => {
    setTestData({
      lastModified: "2024-01-01t00:00:00.000z",
    } as UserData["tests"][string]);
  }, [testCode]);

  return (
    <div>
      <h1>Testo redagavimas</h1>
      <p>Testo kodas: {testCode}</p>
      <pre>{JSON.stringify(testData, null, 2)}</pre>
    </div>
  );
};

export default TestCreateEditPage;
