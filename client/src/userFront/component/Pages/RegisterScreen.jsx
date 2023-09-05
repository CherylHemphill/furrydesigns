import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import auth from '../../../utils/auth';
import { ADD_USER } from '../../../utils/mutations';

// import { toast } from 'react-toastify';
import BannerIcons from '../Products/Layout/BannerIcons';

function RegisterScreen(props) {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [addUser] = useMutation(ADD_USER);
  
    const submitHandler = async (event) => {
      event.preventDefault();
      const mutationResponse = await addUser({
        variables: {
          email: formState.email,
          password: formState.password,
          name: formState.name,
        },
      });
      const token = mutationResponse.data.addUser.token;
      auth.login(token);
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
        
        <div className="bg-rgb(238, 218, 171 min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-6">Register</h1>
    
                <form onSubmit={submitHandler}>
                    <div className="my-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter name"
                            // value={name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="my-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter email"
                            // value={email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="my-3">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter password"
                            // value={password}
                            onChange={handleChange}
                        />
                    </div>
                    {/* <div className="my-3">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div> */}
                    <button
                        type="submit"
                        className="mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Register
                    </button>
                </form>
                <div className="py-3 text-sm">
                    <p>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default RegisterScreen;

// import { useDispatch, useSelector } from 'react-redux';
// import { useRegisterMutation } from '../../../slices/userApiSlice'
// import { setCredentials } from '../../../slices/authSlice';

 //const userInfo  = useSelector(state => state.auth.userInfo);

  // useEffect(() => {
    //     if (userInfo) {
    //         navigate(redirect);
    //     }
    // }, [navigate, redirect, userInfo]);
    // const RegisterScreen = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');

//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const [register, { isLoading }] = useRegisterMutation();

   

//     const { search } = useLocation();
//     const sp = new URLSearchParams(search);
//     const redirect = sp.get('redirect') || '/login';

   

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         if (password !== confirmPassword) {
//             toast.error('Passwords do not match');
//             return;
//         } else {
//             try {
//                 const res = await register({ name, email, password }).unwrap();
//                 dispatch(setCredentials({ ...res }));
//                 navigate(redirect);
//             } catch (err) {
//                 toast.error(err?.data?.message || err.data.error);
//             }
//         }
//     };