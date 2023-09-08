'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, registerWithEmailAndPassword } from '@/app/firebase';
import Spinner from '@/components/spinner';
import Button from '@/components/button';

export default function Signup() {
    const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    document.title = 'Create Account';
    if (user) {
      router.push('/');
    }
  }, [user]);

  const formSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Please check email')
      .required('Please enter correct email'),
    password: Yup.string()
      .required('Password is mendatory')
      .min(6, 'Password must be at 6 char long'),
    cpassword: Yup.string()
      .required()
      .oneOf([Yup.ref('password')], 'Passwords does not match'),
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(formOptions);

  const onSubmit = async ({ name, email, password }) => {
    const res = await registerWithEmailAndPassword(name, email, password);
    if (res) {
      navigate('/login');
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100 px-6">
      <div className="h-min flex flex-col bg-white shadow-lg rounded-lg justify-center items-center text-gray-800 w-full lg:w-2/3 px-4 lg:px-0 lg:p-12 lg:mx-6 py-5">
        <div className="text-center">
          <h2 className="text-xl font-semibold mt-1 mb-12 pb-1">
            Welcome to Gifs Ocean
          </h2>
        </div>
        <form
          className="text-xs md:w-1/2 w-full px-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <input
              {...register('name')}
              type="text"
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
              placeholder="Name"
            />

            {errors.name && (
              <p className="text-xs text-red-700 pt-1">Name is required</p>
            )}
          </div>
          <div className="mb-4">
            <input
              {...register('email')}
              type="text"
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
              placeholder="Email"
            />

            {errors.email && (
              <p className="text-xs text-red-700 pt-1">Please enter correct Email</p>
            )}
          </div>
          <div className="mb-4">
            <input
              {...register('password')}
              type="password"
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
              placeholder="Password"
            />

            {errors.password && (
              <p className="text-xs text-red-700 pt-1">Please enter appropriate Password</p>
            )}
          </div>
          <div className="mb-4">
            <input
              {...register('cpassword')}
              type="password"
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
              placeholder="Confirm Password"
            />
            {errors.cpassword && (
              <p className="text-xs text-red-700 pt-1">
                Please enter correct Confirm Password
              </p>
            )}
          </div>
          <div className="text-center pt-1 mb-6 pb-1">
            <button
              className="inline-block px-6 py-2.5 text-black border-green-600 border font-medium text-xs leading-tight uppercase rounded shadow-md bg-green-100 hover:bg-green-700 hover:text-white hover:shadow-lg  transition duration-150 ease-in-out w-full mb-3 shadow-green-50"
              type="submit"
            >
              Create Account
            </button>
          </div>
          <div className="flex items-center justify-between pb-6 gap-5">
            <p className="mb-0 mr-2 whitespace-nowrap">
              Already have an account?
            </p>
            <Link
              href="/login"
              className="w-full text-center px-6 py-2 border-2 border-green-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              Login
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <hr className="w-full" />
            <span className="p-2 text-gray-400 mb-1">OR</span>
            <hr className="w-full" />
          </div>
          <Button />
        </form>
      </div>
    </div>
  )
}