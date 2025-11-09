import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@/components/header";
import { HomePage } from "@/pages/HomePage";
import { CityDetail } from "@/pages/CityDetail";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/city/:cityName" element={<CityDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
