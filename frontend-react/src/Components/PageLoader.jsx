import React from 'react';

const PageLoader = ({ message = "Loading, please wait..." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <span className="loading loading-ring loading-lg text-primary"></span>
            <p className="text-base-content/60 font-medium animate-pulse">{message}</p>
        </div>
    );
};

export default PageLoader;
