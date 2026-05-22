import Header from "../components/dashboard/Header";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import ConfirmDialog from "../components/common/ConfirmDialog";
import UserNameplate from "../components/admin/UserNameplate";
import RoomPlate from "../components/admin/RoomPlate";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LayoutDashboard, Plus, X, ChevronDown } from "lucide-react";
import Input from "../components/common/Input";
import { useSmartHouse } from "../context/SmartHouseContext";
import { useAuth } from "../context/AuthContext";
// import { Collapse } fromç "react-collapse";
import DevicePlate from "../components/admin/DevicePlate";
import UserModal from "../components/admin/UserModal";
export default function AdminPanel() {
    const [selectedUser, setSelectedUser] = useState(null);
    const { currentUser, logout } = useAuth();
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const { users, rooms, allDevices, send } = useSmartHouse();
    const [toast, setToast] = useState(null);
    const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const navigate = useNavigate();
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [isRoomsOpen, setIsRoomsOpen] = useState(false);
    const [isDevicesOpen, setIsDevicesOpen] = useState(true);

    // confirm dialog handlers
    const openConfirm = ({ title, message, onConfirm }) => {
        setConfirmDialog({ title, message, onConfirm });
    };

    const closeConfirm = () => {
        setConfirmDialog(null);
    }

    // nameplate buttons handlers
    const handleDowngrade = (user) => {
        openConfirm({
            title: "Demote to User",
            message: `Demote ${user.username} to User? Admin features will be lost.`,
            onConfirm: async () => {
                try {
                    await send.demote(user.username);
                    setToast({ message: `${user.username} successfully demoted to User.` });
                } catch (err) {
                    setToast({ message: err.message, isError: true });
                }
                closeConfirm();
            }
        });
    }

    const handleUpgrade = (user) => {
        openConfirm({
            title: "Promote to Admin",
            message: `Promote ${user.username} to Admin? Access to admin features will be granted.`,
            onConfirm: async () => {
                try {
                    await send.promote(user.username);
                    setToast({ message: `${user.username} successfully promoted to Admin.` });
                } catch (err) {
                    setToast({ message: err.message, isError: true });
                }
                closeConfirm();
            }
        });
    }

    const handleDeleteUser = (user) => {
        openConfirm({
            title: "Delete User",
            message: `Delete ${user.username} permanently? This cannot be undone.`,
            onConfirm: async () => {
                try {
                    await send.deleteUser(user.username);
                    setToast({ message: `${user.username} successfully deleted from users.` });
                } catch (err) {
                    setToast({ message: err.message, isError: true });
                }
                closeConfirm();
            }
        });
    }

    // room handlers
    const handleRenameRoom = async (roomId, newName) => {
        try {
            await send.renameRoom(roomId, newName),
            setToast({ message: `Room renamed to "${newName}".` });
        } catch (err) {
            setToast({ message: err.message, isError: true });
        }
    };
 
    const handleDeleteRoom = (room) => {
        // TODO: get devices associated with the room to show deviceCount in message
        openConfirm({
            title: "Delete Room",
            message: `Delete "${room.name}"? ${room.deviceCount > 0 ? `${room.deviceCount} device(s) will become unassigned.` : "This cannot be undone."}`,
            onConfirm: async () => {
                try {
                    await send.deleteRoom(room.id);
                    setToast({ message: `"${room.name}" deleted.` });
                } catch (err) {
                    setToast({ message: err.message, isError: true });
                }
                closeConfirm();
            }
        });
    };
 
    const handleAddRoom = async () => {
        const trimmed = newRoomName.trim();
        if (!trimmed) return;

        try {
            await send.createRoom(newRoomName);
            setToast({ message: `"${trimmed}" added.` });
            setNewRoomName("");
            setIsAddingRoom(false);
        } catch (err) {
            setToast({ message: err.message, isError: true });
        }
    };

    // device handlers
    const handleUpdateDeviceRoom = async (device, room) => {
        if (!room) return;

        try {
            await send.updateDeviceRoom(device.id, room.id);
            setToast({ message: `${device.name} assigned to room ${room.name}.` });
        } catch (err) {
            setToast({ message: err.message, isError: true });
        }
    }

    const handleRenameDevice = async (device, newName) => {
        try {
            await send.renameDevice(device.id, newName),
            setToast({ message: `Device renamed to "${newName}".` });
        } catch (err) {
            setToast({ message: err.message, isError: true });
        }
    }

    const handleRemoveDevice = async (id) => {
        const device = allDevices.find((d) => d.id === id);
        if (!device) return;

        openConfirm({
            title: "Remove Device",
            message: `Are you sure you want to remove "${device.name}"?`,
            onConfirm: async () => {
                closeConfirm();
                try {
                    await send.deleteDevice(id);
                    setToast({ message: `${device.name} successfuly removed.` });
                } catch (err) {
                    setToast({ message: err.message, isError: true });
                }
            },
        });
    }

    const admins = users?.filter((u) => u.type === "admin");

    return (
        <>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            <Header
                title="Admin Panel"
                subtitle={`${users.length} total user(s) · ${admins.length} admin(s)`}
                icon={<Settings className="w-6 h-6 text-white"/>}
                onLogout={logout}
                actions={
                    <Button
                        text="Back to Overview"
                        icon={<LayoutDashboard className="w-4 h-4"/>}
                        onClick={() => navigate("/overview")}
                        variant="ghost"
                    />
                }
            />
            <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* user management section */}
                <section>
                    <div
                        onClick={() => setIsUsersOpen(!isUsersOpen)}
                        className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Users
                        </h2>
                        <ChevronDown className={`text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200`} />
                    </div>
                    { isUsersOpen && (
                        <div className="space-y-3 my-2">
                            {users?.map((u) => (
                                <UserNameplate
                                    key={u.id}
                                    user={u}
                                    currentUser={currentUser}
                                    onUpgrade={handleUpgrade}
                                    onDowngrade={handleDowngrade}
                                    onDelete={handleDeleteUser}
                                    onClick={() => {
                                        setSelectedUser(u);
                                        setIsUserModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </section>
                {/* room management section */}
                <section>
                    <div
                        onClick={() => setIsRoomsOpen(!isRoomsOpen)}
                        className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Rooms
                        </h2>
                        <ChevronDown className={`text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200`} />
                    </div>

                    { isRoomsOpen && (
                        <div className="mt-2">
                            <div className="flex justify-end mb-2">
                                <Button
                                    text="Add Room"
                                    icon={<Plus className="w-5 h-5" />}
                                    variant="primary"
                                    onClick={() => {
                                        setIsAddingRoom(true);
                                        setNewRoomName("");
                                    }}
                                />
                            </div>
                            <div className="space-y-3">
                                {rooms.map((room) => (
                                    <RoomPlate
                                        key={room.id}
                                        room={room}
                                        onRename={handleRenameRoom}
                                        onDelete={handleDeleteRoom}
                                    />
                                ))}

                                {rooms.length === 0 && !isAddingRoom && (
                                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                                        No rooms yet. Add one to get started.
                                    </p>
                                )}

                                {/* Inline add form */}
                                {isAddingRoom && (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-indigo-300 dark:border-indigo-700 rounded-xl">
                                        <Input
                                            autoFocus
                                            type="text"
                                            placeholder="Room name"
                                            value={newRoomName}
                                            onChange={(e) => setNewRoomName(e.target.value)}
                                            className="flex-1 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        />
                                        <Button
                                            text="Add"
                                            variant="primary"
                                            disabled={!newRoomName.trim()}
                                            onClick={handleAddRoom}
                                        />
                                        <Button
                                            variant="ghost"
                                            icon={<X className="w-4 h-4" />}
                                            onClick={() => {
                                                setIsAddingRoom(false);
                                                setNewRoomName("");
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
                <section>
                    <div
                        onClick={() => setIsDevicesOpen(!isDevicesOpen)}
                        className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 rounded-lg hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Devices
                        </h2>
                        <ChevronDown className={`text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200`} />
                    </div>
                    { isDevicesOpen && (
                        <div className="space-y-3 my-2">
                            {allDevices?.map((d) => (
                                <DevicePlate
                                    key={d.id}
                                    device={d}
                                    users={users}
                                    rooms={rooms}
                                    onChangeRoom={handleUpdateDeviceRoom}
                                    onRename={handleRenameDevice}
                                    onDelete={handleRemoveDevice}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>

        <UserModal
            isOpen={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            user={selectedUser}
            devices={allDevices}
            currentUser={currentUser}
            send={send}
            setToast={setToast}
            onUpgrade={handleUpgrade}
            onDowngrade={handleDowngrade}
            onDelete={handleDeleteUser}
        />
    
        {toast && (
            <Toast
                message={toast.message}
                onDismiss={() => setToast(null)}
                isError={toast.isError}
            />
        )}

        <ConfirmDialog
            isOpen={!!confirmDialog}
            title={confirmDialog?.title}
            message={confirmDialog?.message}
            onConfirm={confirmDialog?.onConfirm}
            onCancel={closeConfirm}
        />
        </>
    );
}
