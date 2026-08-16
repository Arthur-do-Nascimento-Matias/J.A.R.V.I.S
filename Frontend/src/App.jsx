import { BrowserRouter, Routes, Route } from "react-router-dom";
import Interface from './pages/Interface'
import Index from "./pages/Index";
import CaseMode from "./pages/CaseMode";

function App() {
    
return(
    <BrowserRouter>
        <Routes>
            <Route path="/jarvis" element={<Interface/>} />
            <Route path="/" element={<Index />} />
            <Route path="/caseMode" element={<CaseMode />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
