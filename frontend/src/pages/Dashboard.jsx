import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SparklesCore } from "../components/ui/sparkles";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="relative flex items-center justify-center">
                <SparklesCore
                  background="transparent"
                  minSize={6.5}
                  maxSize={1}
                  particleDensity={200}
                  className="absolute w-full h-full"
                  particleColor="#1810b9"
                  particleColor2="#10b924"
                  particleColor3="#b91086"
                />
                <h1 className="relative z-20 text-5xl font-bold text-gray-900">CareerOS</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.firstName} {user?.lastName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h2>
            <p className="mt-1 text-sm text-gray-600">Manage your career journey</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">

            {/* Profile */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-indigo-500 p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Profile</dt>
                      <dd className="text-lg font-semibold text-gray-900">Not Set</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button onClick={() => navigate('/profile')} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Complete profile →
                </button>
              </div>
            </div>

            {/* Skills → Profile */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-green-500 p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Skills</dt>
                      <dd className="text-lg font-semibold text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button onClick={() => navigate('/profile')} className="text-sm font-medium text-green-600 hover:text-green-500">
                  Add skills →
                </button>
              </div>
            </div>

            {/* Career Goals */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-yellow-500 p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Career Goals</dt>
                      <dd className="text-lg font-semibold text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button onClick={() => navigate('/goals')} className="text-sm font-medium text-yellow-600 hover:text-yellow-500">
                  Set goals →
                </button>
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-purple-500 p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                      <dd className="text-lg font-semibold text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <button onClick={() => navigate('/applications')} className="text-sm font-medium text-purple-600 hover:text-purple-500">
                  Track jobs →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <button onClick={() => navigate('/resumes')}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-indigo-400 focus:outline-none">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900">Update Resume</p>
                  <p className="text-sm text-gray-500">Upload &amp; manage resumes</p>
                </div>
              </button>

              <button onClick={() => navigate('/analyzer')}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-green-400 focus:outline-none">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900">AI Job Analyzer</p>
                  <p className="text-sm text-gray-500">Match score + suggestions</p>
                </div>
              </button>

              <button onClick={() => navigate('/goals')}
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-purple-400 focus:outline-none">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900">Career Goals</p>
                  <p className="text-sm text-gray-500">Track your progress</p>
                </div>
              </button>

            </div>
          </div>

          {/* Nav shortcuts */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Navigate</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "📋 Applications", path: "/applications" },
                { label: "🎯 Goals",         path: "/goals"         },
                { label: "📄 Resumes",       path: "/resumes"       },
                { label: "✦ AI Analyzer",   path: "/analyzer"      },
                { label: "◉ Profile",        path: "/profile"       },
              ].map(item => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
