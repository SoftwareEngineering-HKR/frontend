import { useState } from "react";

export default function DeviceCard({ title, location, type, isOnline = true, initialState = false }) {
  const [isOn, setIsOn] = useState(initialState);

  // SVG Icons
  const icons = {
    light: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    thermostat: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.046 8.25 8.25 0 0 1 11.824 3.02 5.626 5.626 0 0 1 19.366 3c.6.28 1.15.65 1.625 1.095a5.63 5.63 0 0 1 1.64 4.34m-9.63 12.56-1.701-8.508s-.705-3.522 2.815-3.522 2.815 3.522 2.815 3.522l-1.701 8.508" />
      </svg>
    ),
    lock: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    default: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
      </svg>
    )
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-48 w-full transition-all hover:shadow-md">
      
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center text-primary">
            {icons[type] || icons.default}
        </div>
        <div>
            <h3 className="font-bold text-lg text-text leading-tight">{title}</h3>
            <p className="text-gray-400 text-sm">{location}</p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-sm font-medium">
         <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-400'}`}></span>
         <span className={isOnline ? 'text-green-600' : 'text-red-400'}>
            {isOnline ? 'Online' : 'Offline'}
         </span>
      </div>

      {/* Footer / Control */}
      <div className="flex items-center justify-between mt-2">
        <span className="font-semibold text-gray-700">Power</span>
        
        {/* Custom Toggle Switch */}
        <button 
            onClick={() => setIsOn(!isOn)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-primary' : 'bg-gray-200'}`}
        >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
      </div>

    </div>
  );
}
