import { useParams } from "react-router-dom";
import { AccessibleGrade } from "../../../utils/TYPES";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../../services/firebaseConfig";

const GradePage: React.FC = () => {
  const { testCode, studentId } = useParams<{
    testCode: string;
    studentId: string;
  }>();

  const [accessibleGrade, setAccessibleGrade] = useState<AccessibleGrade>();

  useEffect(() => {
    onValue(ref(database, "accessibleGrades/" + testCode), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAccessibleGrade(data);
      }
    });
  }, []);

  return (
    <div className="view-page-container">
      <h1>Įvertinimas</h1>
      <h3 className="text-center text-2xl">Testo kodas: {testCode}</h3>
      <h3 className="text-center text-2xl">Mokinio ID: {studentId}</h3>
      <div>
        {accessibleGrade?.grades.map((grade, index) => (
          <div key={index}>
            {grade.student === studentId && (
              <div>
                <div>
                  <h1 className="mt-8 mb-0 text-5xl">{grade.grade}</h1>
                  <h3 className="text-center mb-2 text-xl">
                    {grade.points} t. iš {grade.outOf} t.
                  </h3>
                  <p>
                    <strong>Papildomos užduotys: </strong>
                    {grade.additionalPoints} t. iš {grade.outOfAdditional} t.
                  </p>
                  <h3 className="mt-8 text-center">
                    <strong>Mokytojo komentaras:</strong>
                  </h3>
                  <h3 className="text-center mb-8">{grade.teacherComment}</h3>
                </div>
                {grade.gradedResponses?.length > 0 && (
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>Klausimo numeris</th>
                          <th>Pateiktas atsakymas</th>
                          <th>Teisingas atsakymas</th>
                          <th>Taškai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grade.gradedResponses?.map((response, index) => (
                          <tr
                            key={index}
                            className={
                              response.isAdditional
                                ? "bg-gray-300"
                                : "bg-gray-200"
                            }
                          >
                            <td>
                              {response.number}{" "}
                              {response.isAdditional ? "* (papildoma)" : ""}
                            </td>
                            <td>{response.answer}</td>
                            <td>{response.correctAnswer}</td>
                            <td>
                              {response.points} t. iš {response.outOf} t.
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradePage;
