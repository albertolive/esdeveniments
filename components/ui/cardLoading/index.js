import React from 'react';

export default function CardLoading() {
  return (
    <div className="flex justify-center items-center bg-whiteCorp p-4 animate-pulse min-h-[400px]">
        <div className="animate-pulse rounded-2xl h-20 w-20 border-t-4 border-b-4 border-darkCorp"></div>
    </div>
  );
}
