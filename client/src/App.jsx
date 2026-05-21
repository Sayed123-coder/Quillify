import {BrowserRouter,Routes,Route} from "react-router-dom"
import Navbar from "./components/Navbar";
import Home from "./pages/Home.jsx";
import BlogDetail from "./pages/BlogDetail.jsx"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import EditBlog from "./pages/EditBlog.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import Profile from "./pages/Profile.jsx";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess.jsx";

function App() {
 return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home/>} />
        <Route path="/blog/:id" element={<BlogDetail/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
         </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
          } />
        <Route path="/blog/create" element={
          <ProtectedRoute>
             <CreateBlog/>
          </ProtectedRoute>
          
          } />
        <Route path="/blog/edit/:id" element={
          <ProtectedRoute>
           <EditBlog/>
          </ProtectedRoute>
          } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
             <AdminPanel/>
          </ProtectedRoute>
          
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;