import { useEffect, useState } from "react";

interface OverallResultsProps {
  results: { studentId: string; grade: string; points: string }[];
}

const OverallResults: React.FC<OverallResultsProps> = ({ results }) => {
  const [isSorted, setIsSorted] = useState<boolean>(true);
  const [sortedResults, setSortedResults] =
    useState<{ studentId: string; grade: string; points: string }[]>(results);

  useEffect(() => {
    if (isSorted) {
      const sorted = [...results].sort((a, b) =>
        a.studentId.localeCompare(b.studentId)
      );
      setSortedResults(sorted);
    } else {
      setSortedResults(results);
    }
  }, [isSorted, results]);

  return (
    <div>
      <h1>Įvertinimų suvestinė</h1>
      <div className="mb-2">
        <input
          type="checkbox"
          checked={isSorted}
          onChange={(e) => setIsSorted(e.target.checked)}
        />
        <label>Rikiuoti pagal mokinio ID</label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Mokinio ID</th>
            <th>Įvertinimas</th>
            <th>Taškai</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults?.map((result, index) => (
            <tr key={index}>
              <td>{result.studentId}</td>
              <td>{result.grade}</td>
              <td>{result.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OverallResults;
