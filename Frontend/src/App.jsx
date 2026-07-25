import { BrowserRouter, Routes, Route } from "react-router-dom";
import Interface from './components/Interface'
import Index from "./components/Index";

function App() {

return(
    <BrowserRouter>
        <Routes>
            <Route path="/jarvis" element={<Interface />} />
            <Route path="/" element={<Index />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
