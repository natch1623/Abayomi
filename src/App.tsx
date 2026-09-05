import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainPage from "./pages/MainPage"
import LettersPage from "./pages/LettersPage"
import ExperiencePage from "./pages/ExperiencePage"
import HubPage from "./pages/HubPage"
import PancitosPage from "./pages/PancitosPage"
import CivilPage from "./pages/CivilPage"
import AbayomiPage from "./pages/AbayomiPage"
import FuturePage from "./pages/FuturePage"
import UniversePage from "./pages/UniversePage"
import Soundtrack from "./components/Soundtrack"

export default function App() {
  return (
    <BrowserRouter>
      {/* Va dentro del router: la pista depende de la ruta actual. */}
      <Soundtrack />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/cartas" element={<LettersPage />} />
        <Route path="/experiencia" element={<ExperiencePage />} />
        <Route path="/hub" element={<HubPage />} />
        <Route path="/pancito" element={<PancitosPage />} />
        <Route path="/civil" element={<CivilPage />} />
        <Route path="/abayomi" element={<AbayomiPage />} />
        <Route path="/futuro" element={<FuturePage />} />
        <Route path="/universo" element={<UniversePage />} />
      </Routes>
    </BrowserRouter>
  )
}
