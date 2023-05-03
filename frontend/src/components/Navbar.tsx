import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Api from "../Api";

function Navbar() {
  const navigate = useNavigate();
  const logoutQuery = useQuery(["logout"], () => Api.Api.get("/auth/logout"), {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  let token = window.sessionStorage.getItem("jwtToken");

  useEffect(() => {
    token = window.sessionStorage.getItem("jwtToken");
  }, [token]);

  const logout = (event: React.MouseEvent) => {
    event.preventDefault();
    logoutQuery.refetch();
    window.sessionStorage.removeItem("jwtToken");
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <nav className="flex flex-no-wrap relative w-full items-center justify-between bg-neutral-100">
        <div className="flex w-full flex-wrap items-center justify-between ">
          <ul className="flex items-center p-4">
            <li className="mx-5">
              <Link to="/sale" className="hover:text-blue-800">
                Lista sal
              </Link>
            </li>
            <li className="mx-5">
              <Link to="/rezerwacja" className="hover:text-blue-800">
                Rezerwacja
              </Link>
            </li>
            <li className="mx-5">
              <Link to="/import" className="hover:text-blue-800">
                Import danych
              </Link>
            </li>
          </ul>
          <button className="relative flex items-center p-4">
            {!token ? (
              <Link to="/login" className="hover:text-blue-800">
                Zaloguj się
              </Link>
            ) : (
              <Link
                to="/login"
                className="hover:text-blue-800"
                onClick={logout}
              >
                Wyloguj się
              </Link>
            )}
          </button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Navbar;
