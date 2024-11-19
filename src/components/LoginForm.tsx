import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { LoginData } from '../types';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    pin: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', loginData.email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error('User not found');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.pin !== loginData.pin) {
        toast.error('Invalid PIN');
        return;
      }

      localStorage.setItem('userId', userDoc.id);
      toast.success('Login successful');
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setLoginData(prev => ({ ...prev, pin: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <KeyRound className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Login to access Emergency SOS</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                placeholder="Enter your email"
              />
              <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">PIN</label>
            <div className="mt-1 relative">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={loginData.pin}
                onChange={handlePinChange}
                required
                className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                placeholder="Enter 4-digit PIN"
              />
              <KeyRound className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Don't have an account? Register now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}