import { useNavigate } from "react-router-dom";
import { UserData } from "../../../utils/TYPES";
import { RiDeleteBin5Fill, RiEditLine, RiFileCopy2Line } from "react-icons/ri";
import { useState } from "react";

interface TestCardProps {
  test: UserData["tests"][string];
  testCode: string;
  makeTestPrivate: (testCode: string) => void;
  makeTestPublic: (testCode: string) => void;
  deleteTest: (testCode: string) => void;
  copyTest: (testCode: string) => void;
}

const TestCard: React.FC<TestCardProps> = ({
  test,
  testCode,
  makeTestPrivate,
  makeTestPublic,
  deleteTest,
  copyTest,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="test-list-item relative">
      <button
        title="Redaguoti testo užduotis"
        onClick={() => navigate(`/test-create-edit/${testCode}`)}
        className=" absolute top-[-25px] right-[-15px] w-10 h-10 p-2 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <RiEditLine className="w-full h-full p-0 m-0" />
      </button>
      <button
        title="Kopijuoti testo užduotis"
        onClick={() => {
          setLoading(true);
          copyTest(testCode);
        }}
        className=" absolute top-6 right-[-15px]  w-10 h-10 p-2 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {loading ? (
          <div className="bg-orange-500 text-black">
            Kopijuojama... Prašome palaukti
          </div>
        ) : (
          <RiFileCopy2Line className="w-full h-full p-0 m-0" />
        )}
      </button>
      <button
        title="Ištrinti visus testo duomenis"
        onClick={() => deleteTest(testCode)}
        className="absolute  top-[74px] right-[-15px] w-10 h-10 p-2 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <RiDeleteBin5Fill className="w-full h-full p-0 m-0" />
      </button>

      <button
        title="Valdyti testo atlikimą"
        className="goto-test-button"
        onClick={() => navigate(`/test-dashboard/${testCode}`)}
      >
        <div className="test-title">{test?.test?.title}</div>
        <div className="test-key">Kodas: {testCode}</div>
        <div className="test-date">
          Keista: {test?.lastModified?.slice(0, 10)}
        </div>
      </button>
      {test?.test?.isTestAccessible ? (
        <div className="status-container">
          <div className="status-public">VIEŠAS</div>
          <button
            className="make-private-button"
            onClick={() => makeTestPrivate(testCode)}
          >
            Užprivatinti
          </button>
        </div>
      ) : (
        <div className="status-container">
          <div className="status-private">PRIVATUS</div>
          <button
            className="make-public-button"
            onClick={() => makeTestPublic(testCode)}
          >
            Viešinti
          </button>
        </div>
      )}
    </div>
  );
};

export default TestCard;
