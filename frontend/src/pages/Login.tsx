import React, {useEffect, useRef, useState} from "react";
import Api from "../Api";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";

function Login() {
  const navigate = useNavigate();
  const userRef = useRef<HTMLInputElement>();
  const errRef = useRef<HTMLInputElement>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setError("");
  }, [email, password]);

  const tokenMutation = useMutation({
    mutationFn: async () => {
      return await Api.Api.post("auth/authenticate", {
        email: email,
        password: password,
      }).then((res) => res.data);
    },
    onError: (error: AxiosError) => {
      if (!error.response) {
        setError("Brak odpowiedzi serwera");
      } else if (error.response.status === 403) {
        setError("Błędne dane logowania");
      } else {
        setError("Nie udało się zalogować");
      }
      errRef.current?.focus();
    },
  });

  useEffect(() => {
    if (tokenMutation.isSuccess) {
      window.localStorage.setItem("jwtToken", tokenMutation.data?.token);
      setEmail("");
      setPassword("");
      const path = sessionStorage.getItem("page") as string;
      if (path) {
        navigate(path, { replace: true });
        sessionStorage.setItem("page", "");
      } else {
        navigate("/sale");
      }
    }
  }, [tokenMutation.isSuccess]);

  const handleEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await tokenMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center pt-20">
      <div className="w-2/5 pb-14 text-center text-2xl font-medium">
        <p>Logowanie</p>
      </div>
      {error && (
        <p
          ref={errRef}
          className="bg-pink-100 font-bold p-2 mb-2 text-red-700"
          aria-live="asserive"
        >
          {error}
        </p>
      )}
      <div className="w-96 font-medium">
        <form className=" " onSubmit={handleSubmit} method={"POST"}>
          <label className="flex flex-col py-2">
            <span className="flex py-2 after:content-['*'] after:text-red-600 font-bold">
              Email
            </span>
            <input
              type="email"
              name="email"
              ref={userRef}
              placeholder={"adres@email"}
              value={email}
              onChange={handleEmailChange}
              className={
                "py-3 px-5 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none block w-full rounded-md sm:text-sm"
              }
              required
            />
          </label>
          <label className="flex flex-col py-2">
            <span className="flex py-2 after:content-['*'] after:text-red-600 font-bold">
              Hasło
            </span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className={
                "py-3 px-5 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none block w-full rounded-md sm:text-sm"
              }
              required
            />
          </label>
          <div className="flex flex-col justify-center items-center">
            <button
              type="submit"
              className="mt-12 mb-3 px-12 py-2  transition hover:scale-110 delay-150 rounded-lg bg-sky-500
                               hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500"
            >
              Zaloguj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
