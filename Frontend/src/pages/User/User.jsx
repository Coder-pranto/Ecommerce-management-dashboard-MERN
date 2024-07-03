import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { userRegistration } from '../../services/api';
import { toast } from 'react-toastify';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  contact_no: yup.string().required('Contact number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const User = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await userRegistration(data);
      toast.success('User registered successfully');
      reset();  // Clear input fields
    } catch (error) {
      console.error('Error registering user:', error.message);
      toast.error('User registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              {...register('contact_no')}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
            />
            {errors.contact_no && <p className="text-red-500 text-sm">{errors.contact_no.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-100"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
              </div>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="mb-6">
            <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-indigo-200">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default User;
