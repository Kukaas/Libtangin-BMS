import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
            <div className="bg-white/90 rounded-2xl shadow-xl p-10 flex flex-col items-center max-w-md w-full">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-10 h-10 text-blue-600" />
                </div>
                <h1 className="text-5xl font-bold text-blue-700 mb-2">404</h1>
                <p className="text-lg text-slate-700 mb-6 text-center">Sorry, the page you are looking for does not exist or has been moved.</p>
                <Button onClick={() => navigate('/')} className="px-6 py-2 flex items-center gap-2">
                    Go to Home <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
