'use client';
import React from 'react';
import RXForm from '../../../components/form/RXForm';
import { useParams } from 'next/navigation';

const RXPage = () => {
    return (
        <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 bg-gray-100 p-4">
                {/* Side menu or any additional content */}
            </div>
            <div className="w-full md:w-3/4 bg-white p-4">
                <RXForm />
            </div>
        </div>
    );
};

export default RXPage;