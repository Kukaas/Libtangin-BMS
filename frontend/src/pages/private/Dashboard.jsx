import React from 'react';
import MainLayout from '../../layout/MainLayout';

const Dashboard = () => {
    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Dashboard</h1>
                <p className="text-slate-700 text-lg">Welcome to your dashboard! 🎉</p>
                <p className="text-slate-500 mt-2">This is a private page. You can add widgets, stats, and more here.</p>
            </div>
        </MainLayout>
    );
};

export default Dashboard;
