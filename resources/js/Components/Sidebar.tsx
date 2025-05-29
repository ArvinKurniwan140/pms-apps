import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface SidebarProps {
    currentRoute?: string;
}

export default function Sidebar({ currentRoute = 'dashboard' }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
                </svg>
            ),
            route: 'dashboard'
        },
        {
            name: 'Projects',
            href: '/projects',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            route: 'projects'
        },
        {
            name: 'Tasks',
            href: '/tasks',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            route: 'tasks'
        },
        {
            name: 'Calendar',
            href: '/calendar',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            route: 'calendar'
        },
        {
            name: 'Settings',
            href: '/settings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            route: 'settings'
        }
    ];

    const isActiveRoute = (route: string) => {
        return currentRoute.includes(route) || route === currentRoute;
    };

    return (
        <div className={`bg-slate-800 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
                {!isCollapsed && (
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-white">ProjectFlow</span>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                <div className="space-y-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                                isActiveRoute(item.route)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            <span className={`${isActiveRoute(item.route) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <span className="ml-3">{item.name}</span>
                            )}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Logout Section */}
            <div className="px-4 py-4 border-t border-slate-700">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors w-full"
                >
                    <span className="text-slate-400 group-hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </span>
                    {!isCollapsed && (
                        <span className="ml-3">Logout</span>
                    )}
                </Link>
            </div>
        </div>
    );
}