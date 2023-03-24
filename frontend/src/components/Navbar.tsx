import React from "react";
import { Link, Outlet } from "react-router-dom";

function Navbar() {
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
            <Link to="/login" className="hover:text-blue-800">
              Login
            </Link>
          </button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Navbar;
