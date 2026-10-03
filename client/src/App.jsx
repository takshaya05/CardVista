import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Arsimulation from "./pages/Arsimulation";
import Scansection from "./pages/Scansection";
import Uploadsection from "./pages/Uploadsection";
import Viewsection from "./pages/Viewsection";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/ar" element={<Arsimulation />} />
            <Route path="/dashboard/scan" element={<Scansection />} />
            <Route path="/dashboard/upload" element={<Uploadsection />} />
            <Route path="/dashboard/view" element={<Viewsection />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;