import { LandingPage } from "@/components/LandingPage";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return <LandingPage onGetStarted={() => navigate("/client")} />;
};

export default Index;
