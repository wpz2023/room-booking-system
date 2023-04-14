import React, { useEffect, useState } from "react";
import Api from "../Api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const tokenMutation = useMutation({
    mutationFn: async () => {
      let data = await Api.Api.post("auth/authenticate", {
        email: email,
        password: password,
      }).then((res) => res.data);
      return data;
    },
  });

  const handeEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
    setIsEmailValid(true);
    setSubmitted(false);
  };

  const handePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
    setIsPasswordValid(true);
    setSubmitted(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    tokenMutation.mutate();
  };

  useEffect(() => {
    if (tokenMutation.isSuccess) {
      window.sessionStorage.setItem("jwtToken", tokenMutation.data?.token);
      navigate("/import", { replace: true });
    }
  }, [tokenMutation.isSuccess]);

  return (
    <div className="flex flex-col items-center pt-20">
      <div className="w-2/5 pb-14 text-center text-2xl font-medium">
        <p>Logowanie</p>
      </div>
      <div className="w-96 font-medium">
        <form className=" " onSubmit={handleSubmit} method={"POST"}>
          <label className="flex flex-col py-2">
            <span className="flex py-2 after:content-['*'] after:text-red-600 font-bold">
              Email
            </span>
            <input
              type="email"
              name="email"
              placeholder={"adres@email"}
              value={email}
              onChange={handeEmailChange}
              className={
                "py-3 px-5 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none block w-full rounded-md sm:text-sm" +
                (!isEmailValid
                  ? "border-red-600 ring-red-600 ring-2"
                  : "focus:border-sky-500 focus:ring-sky-500 focus:ring-2")
              }
            />

            {!isEmailValid && (
              <p className="py-2 text-red-600">Nieprawidłowy adres email</p>
            )}
          </label>
          <label className="flex flex-col py-2">
            <span className="flex py-2 after:content-['*'] after:text-red-600 font-bold">
              Hasło
            </span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handePasswordChange}
              className={
                "py-3 px-5 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none block w-full rounded-md sm:text-sm" +
                (!isPasswordValid
                  ? "border-red-600 ring-red-600 ring-2"
                  : "focus:border-sky-500 focus:ring-sky-500 focus:ring-2")
              }
            />

            {!isPasswordValid && (
              <p className="py-2 text-red-600">Nieprawidłowe hasło</p>
            )}
          </label>
          <div className="flex flex-col justify-center items-center">
            <button
              type="submit"
              className="mt-12 mb-3 px-12 py-2  transition hover:scale-110 delay-150 rounded-lg bg-sky-500
                               hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500"
            >
              Zaloguj
            </button>
            {isPasswordValid && isEmailValid && submitted && (
              <p className="py-2 text-green-500">Dane poprawne</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
