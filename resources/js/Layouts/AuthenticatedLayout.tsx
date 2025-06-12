import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  FolderOpen,
  CheckSquare,
  Users,
  Settings,
  Bell,
  Search,
  Calendar,
  BarChart3,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Moon,
  Sun,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { AdminOnly } from '@/Components/RoleBasedComponent';

interface AuthenticatedLayoutProps {
  header?: ReactNode;
  user: {
    name: string;
    email?: string;
    roles?: string[];
  };
}

const AuthenticatedLayout: React.FC<PropsWithChildren<AuthenticatedLayoutProps>> = ({
  header,
  children,
  user
}) => {
  const { auth } = usePage().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarProfileDropdownOpen, setSidebarProfileDropdownOpen] = useState(false);
  const [navbarProfileDropdownOpen, setNavbarProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed) {
      setSidebarCollapsed(JSON.parse(savedCollapsed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const currentUser = user || auth?.user;

  const isAdmin = currentUser?.roles?.includes('Admin');
  const isProjectManager = currentUser?.roles?.includes('Project Manager');

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: true },
    { name: 'Projects', href: '/projects', icon: FolderOpen, current: false },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, current: false },
    // { name: 'Calendar', href: '/calendar', icon: Calendar, current: false },
    { name: 'Manage User', href: '/users', icon: Users, current: false, adminOnly: true },
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
  ];

  const filteredNavigation = navigation.filter(item =>
    !item.adminOnly || (item.adminOnly && (isAdmin))
  );

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setSidebarProfileDropdownOpen(false);
    setNavbarProfileDropdownOpen(false);

    router.post('/logout', {}, {
      onSuccess: () => {
        window.location.href = '/login';
      },
      onError: () => {
        window.location.href = '/login';
      },
      onFinish: () => {
        setIsLoggingOut(false);
      }
    });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 flex z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ProjectHub</span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${item.current
                ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'
                }`} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile user info dengan logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
              <p className="text-xs text-gray-500">{currentUser?.email}</p>
            </div>
          </div>

          {/* Mobile logout button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden md:fixed md:inset-y-0 md:flex ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'} md:flex-col transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">ProjectHub</h1>
                  <p className="text-xs text-gray-500 whitespace-nowrap">Project Management</p>
                </div>
              )}
            </div>

            {/* Collapse Toggle Button - moved here */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${item.current
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:shadow-md'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className={`h-5 w-5 shrink-0 ${item.current ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'
                    } ${sidebarCollapsed ? '' : 'mr-4'}`} />
                  {!sidebarCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User section */}
          {!sidebarCollapsed ? (
            <div className="border-t border-gray-200 p-4">
              <div className="relative">
                <button
                  onClick={() => setSidebarProfileDropdownOpen(!sidebarProfileDropdownOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-white">
                        {currentUser?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3 text-left min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</p>
                      <p className="text-xs text-gray-500 capitalize truncate">
                        {currentUser?.roles?.[0] || 'Team Member'}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${sidebarProfileDropdownOpen ? 'rotate-180' : ''
                    }`} />
                </button>

                {/* Profile dropdown */}
                {sidebarProfileDropdownOpen && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setSidebarProfileDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Collapsed user section - only avatar
            <div className="border-t border-gray-200 p-4">
              <div className="relative group">
                <button
                  onClick={() => setSidebarProfileDropdownOpen(!sidebarProfileDropdownOpen)}
                  className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {/* Tooltip for collapsed user */}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {currentUser?.name}
                </div>

                {/* Profile dropdown for collapsed state */}
                <AnimatePresence>

                  {sidebarProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-0 right-0 mb-2 origin-top bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</p>
                          <p className="text-xs text-gray-500 capitalize truncate">
                            {currentUser?.roles?.[0] || 'Team Member'}
                          </p>
                        </div>
                        {userNavigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setSidebarProfileDropdownOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {isLoggingOut ? 'Signing out...' : 'Sign out'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className={`${sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'} flex flex-col flex-1 transition-all duration-300`}>
        {/* Top navigation bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects, tasks, or team members..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              {/* Help */}
              <button className="p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* Desktop user avatar */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setNavbarProfileDropdownOpen(!navbarProfileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Desktop top profile dropdown */}
                {navbarProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setNavbarProfileDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page header */}
        {header && (
          <header className="bg-white border-b border-gray-200">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              {header}
            </div>
          </header>
        )}

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;