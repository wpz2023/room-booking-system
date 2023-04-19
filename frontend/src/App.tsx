import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Rooms from "./components/Rooms";
import Reservation from "./components/Reservation";
import ImportData from "./components/ImportData";
import Login from "./components/Login";
import Room from "./components/Room";
import AuthRoute from "./AuthRoute";
import Api from "./Api";

function AxiosInterceptorNavigate() {
  let navigate = useNavigate();
  Api.AxiosInterceptorsSetup(navigate);
  return <></>;
}

function App() {
  return (
    <div className="App">
      {<AxiosInterceptorNavigate />}
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="sale">
            <Route index element={<Rooms />} />
            <Route path=":id" element={<Room />} />
          </Route>
          <Route path="rezerwacja" element={<Reservation />} />
          <Route
            path="import"
            element={
              <AuthRoute>
                <ImportData />
              </AuthRoute>
            }
          ></Route>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<div>Nie znaleziono strony </div>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
