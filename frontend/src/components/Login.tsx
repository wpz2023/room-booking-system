import React from 'react'

function Login() {
  return (
    <div className="flex justify-center">
        <div className='p-6 w-1/2' >
          <form className="flex flex-col w-full ">
            <label className="flex flex-col ph-20">
              <span className="flex py-2 after:content-['*'] after:text-red-600">Email</span>
              <input type="email" name="email" placeholder={"adres@email"}
                        className="peer py-2 px-5 border focus:border-b-blue-500 focus:ring-blue-500 rounded-md"></input>
              <p className="py-2 invisible peer-invalid:visible text-red-600">Nieprawidłowy adres email</p>
            </label>
            <label className="flex flex-col ph-20">
                <span className="flex py-2 after:content-['*'] after:text-red-600">Hasło</span>
                <input type="password" name="password"
                       className="peer py-2 px-5 border focus:border-b-blue-500 focus:ring-blue-500 rounded-md"></input>
            </label>
            <input type="submit" value="Zaloguj" className="w-15 h-15 justify-end"></input>
          </form>
        </div>
    </div>
  );
}

export default Login