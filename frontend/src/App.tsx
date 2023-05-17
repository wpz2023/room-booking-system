import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Rooms from "./pages/Rooms";
import Reservation from "./pages/Reservation";
import ImportData from "./pages/ImportData";
import Login from "./pages/Login";
import Room from "./pages/Room";
import AuthRoute from "./AuthRoute";
import Api from "./Api";
import Reservations from "./pages/Reservations";

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
          <Route path="rezerwacja">
            <Route
              index
              element={
                <AuthRoute>
                  <Reservations />
                </AuthRoute>
              }
            />
            <Route
              path=":id"
              element={
                <AuthRoute>
                  <Reservation />
                </AuthRoute>
              }
            />
          </Route>

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
