import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({
    service,
    onApply,
    className = "",
    showRequirements = true,
    showApplyButton = true
}) => {
    const IconComponent = service.icon;

    const handleApply = () => {
        if (onApply) {
            onApply(service);
        }
    };

    return (
        <Card className={`flex flex-col h-full group hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer ${className}`}>
            <CardHeader className="pb-4">
                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription className="text-sm">
                    {service.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between pt-0">
                {showRequirements && service.requirements && (
                    <div className="mb-4">
                        <p className="text-xs font-medium text-slate-600 mb-3">Requirements:</p>
                        <ul className="space-y-1">
                            {service.requirements.map((req, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                                    <span className="text-xs text-slate-600">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {showApplyButton && (
                    <Button
                        className="w-full mt-auto"
                        variant="outline"
                        onClick={handleApply}
                    >
                        Apply Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default ServiceCard;
