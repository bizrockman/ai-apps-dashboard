import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome to KI Dashboard</h2>
            <p className="text-gray-600 mt-2">Please sign in to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm text-center">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          {/* Available Logins - Subtle Version */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-500 mb-2">Available test accounts:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><code className="bg-gray-50 px-1 py-0.5 rounded">demo/demo</code> - Demo Access (All Apps)</p>
              <p><code className="bg-gray-50 px-1 py-0.5 rounded">consulting/consulting</code> - Consulting Apps</p>
              <p><code className="bg-gray-50 px-1 py-0.5 rounded">ecommerce/ecommerce</code> - E-Commerce Apps</p>
              <p><code className="bg-gray-50 px-1 py-0.5 rounded">kammer/kammer</code> - Chamber Apps</p>
              <p><code className="bg-gray-50 px-1 py-0.5 rounded">master/master</code> - All Apps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;