import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar( ) {
  const [isOpen, setIsOpen] = useState(false);
  const[token,setToken]=useState();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

useEffect(()=>{

  function fetchlogindata(){
    const token=localStorage.getItem('token');
    if(token){
      console.log("token from navbar:", token);
      setToken(token)
    }else{
   alert('Login or Register to continue ');
    }
  }
fetchlogindata();
},[]);

const logout=()=>{
localStorage.removeItem("token");
localStorage.removeItem("user");
alert("your are logged out! redirecting to login page in 2 secs");
 
}

  return (
    <nav className="bg-slate-900 text-white shadow-lg border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center"  >
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              RentEase
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
           

    {
      token ?
      
         <Link 
              to="/auth/login"
              onClick={logout}
              className="hover:text-red-400 transition-colors duration-200 font-medium"
            >
              Logout
      </Link> :
       <Link 
              to="/auth/login"
              className="hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Login
            </Link>
    }
           

  

            <Link 
              to="/auth/register"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            className="block px-3 py-2 rounded-md hover:bg-slate-700 transition-colors duration-200 font-medium"
          >
            Home
          </a>

            {

              token ? 
              <Link 
              to='/auth/login'
              onClick={logout}
              className="block px-3 py-2 rounded-md hover:bg-slate-700 transition-colors duration-200 font-medium"
              >Logout</Link>
              
              : 
              <Link
            to="/auth/login"
            onClick={(e) => {
              e.preventDefault();
           
              setIsOpen(false);
            }}
            className="block px-3 py-2 rounded-md hover:bg-slate-700 transition-colors duration-200 font-medium"
          >
            Login
          </Link>
            }
 
          <Link 
            to="/auth/register"
            onClick={() => {
               setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium transition-all duration-200 cursor-pointer"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
