import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const auth = window.sessionStorage.getItem("jwtToken");
  sessionStorage.setItem("page", location.pathname);
  return auth ? children : <Navigate to="/login" />;
};

export default AuthRoute;
