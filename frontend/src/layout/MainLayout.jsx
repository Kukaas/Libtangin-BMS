import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

const MainLayout = ({ children }) => {
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Sidebar - Sticky on desktop */}
            <div className="hidden lg:block">
                <Sidebar onLogout={logout} />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                    <span className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span>Libtangin BMS</span>
                    </span>
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                        <SheetTrigger asChild>
                            <button
                                className="p-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                aria-label="Open sidebar"
                            >
                                <Menu className="w-6 h-6 text-blue-600" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64 max-w-full">
                            <Sidebar onLogout={logout} />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Main content - Scrollable */}
                <main className="flex-1 p-4 lg:p-6 bg-gradient-to-br from-slate-50 to-blue-50 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
