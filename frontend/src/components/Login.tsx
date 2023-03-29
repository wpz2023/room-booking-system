import React from 'react'

function Login() {
  return (
    <div className="flex flex-col items-center pt-20">
        <div className="w-2/5 pb-14 text-center text-2xl font-medium">
            <p>Logowanie</p>
        </div>
        <div className='w-96'>
          <form className=" ">
            <label className="flex flex-col py-2">
              <span className="flex py-2 after:content-['*'] after:text-red-600 font-bold">Email</span>
              <input type="email" name="email" placeholder={"adres@email"}
                        className="peer py-2 px-5 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"></input>
              <p className="py-2 invisible peer-invalid:visible text-red-600">Nieprawidłowy adres email</p>
            </label>
            <label className="flex flex-col py-2">
                <span className="flex py-2 after:content-['*'] after:text-red-600 font-bold">Hasło</span>
                <input type="password" name="password"
                       className="peer py-2 px-5 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"></input>
            </label>
            <div className="flex justify-center">
                <input type="submit" value="Zaloguj"
                       className="my-12 px-12 py-2  transition hover:scale-110 delay-150 rounded-lg bg-sky-500 hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500"></input>
            </div>

          </form>
        </div>
    </div>
  );
}

export default Login