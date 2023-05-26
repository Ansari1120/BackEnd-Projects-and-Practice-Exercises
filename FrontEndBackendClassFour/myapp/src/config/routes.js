import { BrowserRouter, Route, Routes } from "react-router-dom";
import Courses from "../components/Courses";
import Singlecard from "../components/singlecard";

export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Courses />} />
          <Route path="/Singlecard/:id" element={<Singlecard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
