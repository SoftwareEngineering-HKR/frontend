import DeviceCard from "./DeviceCard";

export default function DeviceList(props) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {props.filteredDevices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onAction={props.onDeviceAction}
            onRemove={props.onRemoveDevice}
            isAdmin={props.isAdmin}
          />
        ))}
      </div>
    </>
  );
}
