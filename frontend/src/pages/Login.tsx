import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
             <span className="text-orange-500">B-Ball</span> AI
          </h1>
          <p className="mt-2 text-gray-400">Sign in to access your dashboard</p>
        </div>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="••••••••"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
        </form>
         <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="#" className="font-medium text-orange-500 hover:underline">
                Sign up
            </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
