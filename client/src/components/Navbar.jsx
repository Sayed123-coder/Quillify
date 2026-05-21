import useAuth from "../hooks/useAuth.js"
import {Link, useNavigate} from "react-router-dom"

function Navbar() {
    const {user,logout}=useAuth();
    const navigate=useNavigate();

    const handleLogout=()=>{
        logout();
        navigate("/");
    }
  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-50">
         
         <Link to="/" className="text-xl font-semibold text-gray-800">
            Quill<span className="text-indigo-500">ify</span>
         </Link>

         <div className="flex items-center gap-3">
            {!user ?(
                <>
                <Link
                  to="/login"
                 className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"  
                >
                    Login
                </Link>
                 <Link
                  to="/register"
                  className="text-sm px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
                 >
                   Start Writing
                </Link>
                </>
            ):(
                <>
                  {user.role === "admin" && (
                    <Link 
                      to="/admin"
                      className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Admin Panel
                    </Link>
                  )}

                  {user.role !== "admin" && (
                  <Link
                     to="/dashboard"
                     className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                 >
                   Dashboard
                   </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
                  >
                     Logout
                  </button>
                </>
            )}
         </div>
    </nav>
  )
}

export default Navbar;