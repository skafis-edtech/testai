import { useNavigate } from "react-router-dom";

const ExportPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="view-page-container">
      <div className="flex mt-4 mb-12">
        <div className="w-3/12">
          <button
            className="px-4 py-2 w-20 rounded-md "
            onClick={() => navigate(-1)}
          >
            Grįžti
          </button>
        </div>
        <div className="w-6/12">
          <h1>Duomenų eksportas</h1>
        </div>
        <div className="w-3/12"></div>
      </div>
      <h1>Kol kas automatinis duomenų eksportas nėra įgyvendintas.</h1>
      <h1>
        Dėl rankinio duomenų eksporto kreipkitės į platformos administratorių
        el. paštu{" "}
        <a href="mailto:naglis.suliokas@gmail.com">naglis.suliokas@gmail.com</a>
      </h1>
    </div>
  );
};

export default ExportPage;
