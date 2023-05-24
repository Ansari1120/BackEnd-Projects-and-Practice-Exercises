import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../components/navbar";
import Singlecard from "../components/singlecard";



export default function AppRouter() {
    return (
        <>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navbar />} />
              <Route path="/Singlecard/:id" element={<Singlecard />} />
              
            </Routes>
          </BrowserRouter>
        </>
      );
}