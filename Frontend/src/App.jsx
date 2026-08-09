import { BrowserRouter, Routes, Route } from "react-router-dom";
import Interface from './components/Interface'
import Index from "./components/Index";
import CaseMode from "./components/CaseMode";

function App() {

return(
    <BrowserRouter>
        <Routes>
            <Route path="/jarvis" element={<Interface />} />
            <Route path="/" element={<Index />} />
            <Route path="/caseMode" element={<CaseMode />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
