import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    signOut(auth)
      .then(() => navigate("/login"))
      .catch((error: any) => {
        alert("Klaida atsijungiant: " + error.message);
        console.error("Signout error: " + error.message);
      });
    //TODO: something here is wrong/not secure
  }, []);

  return (
    <div>
      <h1>Atsijungiama...</h1>
    </div>
  );
};

export default LogoutPage;
