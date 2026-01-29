import { Routes, Route, useNavigate } from "react-router-dom";
import ChooseBusinessType from "./ChooseBusinessType";
import StartYourBusinessContent from "./StartYourBusinessContent";

const StartYourBusiness = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Routes>
        <Route
          path="/"
          element={<StartYourBusinessContent onNext={() => navigate("choose")} />}
        />
        <Route
          path="choose"
          element={<ChooseBusinessType onBack={() => navigate("/startbusiness")} />}
        />
      </Routes>
    </div>
  );
};

export default StartYourBusiness;
  