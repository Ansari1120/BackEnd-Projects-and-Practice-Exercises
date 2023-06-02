import { BrowserRouter, Route, Routes } from "react-router-dom";
import Courses from "../components/CouseScreen/Courses";
import Singlecard from "../components/CouseScreen/singlecard";
import EditPost from "../components/studentScreen/studentedit";
import Students from "../components/studentScreen/student";
import Studentcard from "../components/studentScreen/studentcard";
import StudentCrouse from "../components/studentScreen/studentCrouse";
import Studentedit from "../components/studentScreen/studentedit";
import Institute from "../components/InstituteScreen/Institute";
import EditIntitute from "../components/InstituteScreen/editIntitute";
import PostIntitute from "../components/InstituteScreen/postIntitute";
import SingleInstitute from "../components/InstituteScreen/singleInstitute";
import Teacher from "../components/TeacherScreen/Teacher";
import SingleTeacher from "../components/TeacherScreen/singleTeacher";
import PostTeacher from "../components/TeacherScreen/postTeacher";
import EditTeacher from "../components/TeacherScreen/editTeacher";
import PostCrouse from "../components/CouseScreen/postCrouse";

export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/courses" element={<Courses />} />
          <Route path="/Singlecard/:id" element={<Singlecard />} />
          <Route path="/crouseadd" element={<PostCrouse />} />
          <Route path="/editPost/:id" element={<EditPost />} />
          {/* end crouse */}

          <Route path="/student" element={<Students />} />
          <Route path="/Studentcard/:id" element={<Studentcard />} />
          <Route path="/StudentCrouse" element={<StudentCrouse />} />
          <Route path="/Studentedit/:id" element={<Studentedit />} />

          {/* end Institute */}

          <Route path="/Institute" element={<Institute />} />
          <Route path="/SingleInstitute/:id" element={<SingleInstitute />} />
          <Route path="/PostIntitute" element={<PostIntitute />} />
          <Route path="/EditIntitute/:id" element={<EditIntitute />} />
          {/* end Teacher */}

          <Route path="/Teacher" element={<Teacher />} />
          <Route path="/SingleTeacher/:id" element={<SingleTeacher />} />
          <Route path="/PostTeacher" element={<PostTeacher />} />
          <Route path="/EditTeacher/:id" element={<EditTeacher />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
