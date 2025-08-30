import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext'; 
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Register = () => {
    const { axios, setToken } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('author');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/admin/register', { 
                email, 
                password, 
                role 
            });

            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                axios.defaults.headers.common['Authorization'] = `${data.token}`;
                toast.success('Registration successful!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30
            shadow-xl shadow-primary/15 rounded-lg'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='w-full py-6 text-center'>
                        <h1 className='text-3xl font-bold'>
                            <span className='text-primary'>Register</span> Account
                        </h1>
                        <p className='font-light'>Create your account to access the panel</p>
                    </div>
                    <form onSubmit={handleSubmit} className='mt-6 w-full sm:max-wmd
                    text-gray-600'>
                        <div className='flex flex-col'>
                            <label>Email</label>
                            <input
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                required
                                placeholder='your email id'
                                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label>Password</label>
                            <input
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                type="password"
                                required
                                placeholder='your password'
                                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
                            />
                        </div>

                        <div className='flex flex-col mb-6'>
                            <label>Role</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className='border-b-2 border-gray-300 p-2 outline-none'
                            >
                                <option value="author">Author</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button
                            type='submit'
                            className='w-full py-3 font-medium bg-primary
                            text-white rounded cursor-pointer hover:bg-primary/90
                            transition-all'
                        >
                            Register
                        </button>

                        <p className='mt-4 text-center'>
                            Already have an account? <Link to="/login" className='text-primary hover:underline'>Login here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;