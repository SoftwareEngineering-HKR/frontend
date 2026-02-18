import SearchBar from "../components/dashboard/SearchBar";
import Header from "../components/dashboard/Header";
import DeviceList from "../components/dashboard/DeviceList";
import Button from "../components/common/Button";

export default function Overview(props) {
  return (
    <>
      {/* Header */}
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        <Header devices={props.devices} onLogOut={props.onLogOut} />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SearchBar />
        <Button text="Add Device" />
        <DeviceList />
      </main>
    </>
  );
}
