import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Body from "./components/body/body";

function App() {
  return (
    <div className="main">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Body />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
