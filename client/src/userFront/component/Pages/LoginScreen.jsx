import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN } from '../../../utils/mutations';
import auth from '../../../utils/auth';

// import { toast } from 'react-toastify';
import BannerIcons from '../Products/Layout/BannerIcons';

function LoginScreen(props) {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error }] = useMutation(LOGIN);
  
    const submitHandler = async (event) => {
      event.preventDefault();
      try {
        const mutationResponse = await login({
          variables: { email: formState.email, password: formState.password },
        });
        const token = mutationResponse.data.login.token;
        auth.login(token);
      } catch (e) {
        console.log(e);
      }
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormState({
        ...formState,
        [name]: value,
      });
    };


    return (
       <div>
              <BannerIcons />
       
        <div className="flex items-center justify-center h-screen bg-body">
            <div className="w-full max-w-md p-6 bg-offWhite rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4 ">Sign In</h1>

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Enter email"
                            // value={email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Enter password"
                            // value={password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-1/3 bg-darkBlue hover:bg-teal text-white py-2 rounded shadow-md"
                    >
                        Sign In
                    </button>
                </form>

                <div className="py-3">
                    <p className="text-sm">
                        New Customer?{' '}
                        <Link to="/register" className="text-burntOrange hover:text-teal">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default LoginScreen;


// import { Link, useLocation, useNavigate } from 'react-router-dom'

// import { useDispatch, useSelector } from 'react-redux'

// import { useLoginMutation } from '../../../slices/userApiSlice';
// import { setCredentials } from '../../../slices/authSlice'


// const LoginScreen = () => {
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('');
    
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const [login] = useLoginMutation();

//     //const { userInfo } = useSelector(state => state.auth);

//     const { search } = useLocation();
//     const sp = new URLSearchParams(search);
//     const redirect = sp.get('redirect') || '/Shop';

//     // useEffect(() => { 
//     //     if(userInfo){
//     //         navigate(redirect);
//     //     }
//     // }, [navigate, redirect, userInfo]);

//     const submitHandler = async (e) =>{
//         e.preventDefault()
//         try {
//             const res = await login({email, password}).unwrap();
//             dispatch(setCredentials({...res}));
//             navigate(redirect);
//         } catch (err) {
//             toast.error(err?.data?.message || err.data.error);
//         }
//     };