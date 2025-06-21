import React from 'react';
import { Card, CardContent } from '../ui/card';

const ContactCard = ({ icon: Icon, title, content }) => {
    return (
        <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600">{content}</p>
            </CardContent>
        </Card>
    );
};

export default ContactCard;
