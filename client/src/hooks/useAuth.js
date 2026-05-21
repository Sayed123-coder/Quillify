import { useContext } from "react";
import AuthContext from "../context/AuthContext.js";

const useAuth = () => useContext(AuthContext);

export default useAuth;