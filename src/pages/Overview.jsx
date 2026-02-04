import Button from "../components/common/Button";
import SearchBar from "../components/dashboard/SearchBar";
import DeviceCard from "../components/dashboard/DeviceCard";
import LogOutButton from "../components/auth/LogOutButton";

export default function Overview() {
    
  const plusIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-8">
      
      {/* Top Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
            <div className="bg-primary text-white p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </div>
            <div>
                <h1 className="text-2xl font-bold text-text">Smart Home</h1>
                <p className="text-gray-500 text-sm">8 online · 2 offline</p>
            </div>
        </div>
        <LogOutButton />
      </header>

      {/* Action Bar */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
            <SearchBar />
        </div>
        <Button text="Add Device" icon={plusIcon} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DeviceCard 
            title="Living Room Light" 
            location="Living Room" 
            type="light" 
            initialState={true} 
        />
        <DeviceCard 
            title="Bedroom Light" 
            location="Bedroom" 
            type="light" 
            initialState={false} 
        />
        <DeviceCard 
            title="Main Thermostat" 
            location="Living Room" 
            type="thermostat" 
            isOnline={true}
        />
        {/* Placeholder for camera/other items */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-48 flex flex-col items-center justify-center text-gray-300 gap-2 border-dashed border-2">
            <span className="text-4xl">+</span>
            <span>Add New Device</span>
        </div>
      </div>

    </div>
  );
}
