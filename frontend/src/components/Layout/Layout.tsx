import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    BookOpenIcon,
    PuzzlePieceIcon,
    ChartBarIcon,
    UserCircleIcon
} from '@heroicons/react/solid';

interface LayoutProps {
    children: React.ReactNode;
    userId: string;
    animalTheme: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, userId, animalTheme }) => {
    const location = useLocation();

    const navigation = [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Stories', href: '/stories', icon: BookOpenIcon },
        { name: 'Games', href: '/games', icon: PuzzlePieceIcon },
        { name: 'Progress', href: '/progress', icon: ChartBarIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <img
                                    src={`/svannah_animals/${animalTheme.toLowerCase()}_avatar.png`}
                                    alt="Animal Avatar"
                                    className="h-8 w-8 rounded-full"
                                />
                                <span className="text-xl font-bold text-gray-900">
                                    Safari Savanna
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/profile"
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                            >
                                <UserCircleIcon className="h-6 w-6" />
                                <span>Profile</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
                <div className="flex justify-around">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="flex flex-col items-center py-2 px-3 text-sm"
                            >
                                <item.icon
                                    className={`h-6 w-6 ${
                                        isActive ? 'text-blue-500' : 'text-gray-400'
                                    }`}
                                />
                                <span
                                    className={`mt-1 ${
                                        isActive ? 'text-blue-500' : 'text-gray-500'
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Sidebar Navigation (Desktop) */}
            <nav className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200">
                <div className="h-full flex flex-col">
                    <div className="flex-1 py-4">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-4 py-3 text-sm ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <item.icon
                                        className={`h-5 w-5 mr-3 ${
                                            isActive ? 'text-blue-500' : 'text-gray-400'
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Adjust main content margin for desktop sidebar */}
            <div className="md:ml-64">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}; 