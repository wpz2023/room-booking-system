import React, {useState} from 'react'


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    const handeEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
        setEmail(event.currentTarget.value);
        setIsEmailValid(true);
        setSubmitted(false);
    }

    const handePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
        setIsPasswordValid(true);
        setSubmitted(false);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (email != "test@email.com") {
            setIsEmailValid(false);
            setSubmitted(false);
        }
        if( password != "password") {
            setIsPasswordValid(false);
            setSubmitted(false);
        }
        if (isPasswordValid && isEmailValid) {
            setSubmitted(true);
        }
    };

    return (
        <div className="flex flex-col items-center pt-20">
            <div className="w-2/5 pb-14 text-center text-2xl font-medium">
                <p>Logowanie</p>
            </div>
            <div className='w-96 font-medium'>
                <form className=" " onSubmit={handleSubmit} method={"POST"}>
                    <label className="flex flex-col py-2">
                        <span className="flex py-2 after:content-['*'] after:text-red-600 font-bold">Email</span>
                        {!isEmailValid ?
                            <input type="email" name="email" placeholder={"adres@email"} value={email} onChange={handeEmailChange}
                                   className=" py-3 px-5 border shadow-sm border-slate-300 placeholder-slate-400
                                   border-red-600 ring-red-600 block w-full rounded-md sm:text-sm focus:ring-1"/> :
                            <input type="email" name="email" placeholder={"adres@email"} value={email} onChange={handeEmailChange}
                                   className=" py-3 px-5 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none
                                   focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"/>}
                        {!isEmailValid ? <p className="py-2 text-red-600">Nieprawidłowy adres email</p> : <p></p>}
                    </label>
                    <label className="flex flex-col py-2">
                        <span className="flex py-2 after:content-['*'] after:text-red-600 font-bold">Hasło</span>
                        {!isPasswordValid ?
                            <input type="password" name="password" value={password} onChange={handePasswordChange}
                                   className="py-3 px-5 border shadow-sm border-slate-300 placeholder-slate-400
                                   border-red-600 ring-red-600 block w-full rounded-md sm:text-sm focus:ring-1"/> :
                            <input type="password" name="password" value={password} onChange={handePasswordChange}
                                    className="py-3 px-5 border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none
                                    focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"/>
                        }
                        {!isPasswordValid ? <p className="py-2 text-red-600">Nieprawidłowe hasło</p> : <p></p>}
                    </label>
                    <div className="flex flex-col justify-center items-center">
                        <input type="submit" value="Zaloguj"
                               className="mt-12 mb-3 px-12 py-2  transition hover:scale-110 delay-150 rounded-lg bg-sky-500
                               hover:bg-sky-700 hover:shadow-sky-700 text-white shadow-lg shadow-sky-500"></input>
                        {isPasswordValid && isEmailValid && submitted ? <p className="py-2 text-green-500">Dane poprawne</p> : <p></p>}
                    </div>
                </form>
            </div>
        </div>
    );
}

 export default Login