import Header from "../components/dashboard/Header";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import UserNameplate from "../components/admin/UserNameplate";
import RoomPlate from "../components/admin/RoomPlate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LayoutDashboard, Plus, X } from "lucide-react";

const MOCK_ROOMS = [
  { id: "r-1", name: "Living Room", deviceCount: 4 },
  { id: "r-2", name: "Kitchen", deviceCount: 2 },
  { id: "r-3", name: "Bedroom", deviceCount: 3 },
  { id: "r-4", name: "Office", deviceCount: 1 },
];

export default function AdminPanel({ users, currentUser, onUsersChange, onLogout }) {
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [rooms, setRooms] = useState(MOCK_ROOMS);
    const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const navigate = useNavigate();

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
            message: `Demote ${user.name} to User? Admin features will be lost.`,
            onConfirm: () => {
                // proper logic with backend missing
                // hardcoded role change
                onUsersChange((prev) =>
                    prev.map((u) => (u.id === user.id ? { ...u, role: "user" } : u))
                );
                setToast({ message: `${user.name} successfully demoted to User.` });
                closeConfirm();   
            }
        });
    }

    const handleUpgrade = (user) => {
        openConfirm({
            title: "Promote to Admin",
            message: `Promote ${user.name} to Admin? Access to admin features will be granted.`,
            onConfirm: () => {
                // proper logic with backend missing
                // hardcoded role change
                onUsersChange((prev) =>
                    prev.map((u) => (u.id === user.id ? { ...u, role: "admin" } : u))
                );
                setToast({ message: `${user.name} successfully promoted to Admin.` });
                closeConfirm();   
            }
        });
    }

    const handleDeleteUser = (user) => {
        openConfirm({
            title: "Delete User",
            message: `Delete ${user.name} permanently? This cannot be undone.`,
            onConfirm: () => {
                // proper logic with backend missing
                // hardcoded "deletion" (just filtered)
                onUsersChange((prev) =>
                    prev.filter((u) => u.id !== user.id)
                );
                setToast({ message: `${user.name} successfully deleted from users.` });
                closeConfirm();   
            }
        });
    }

    // room handlers
    const handleRenameRoom = (roomId, newName) => {
        // replace with API call to backend
        setRooms((prev) =>
            prev.map((r) => (r.id === roomId ? { ...r, name: newName } : r))
        );
        setToast({ message: `Room renamed to "${newName}".` });
    };
 
    const handleDeleteRoom = (room) => {
        openConfirm({
            title: "Delete Room",
            message: `Delete "${room.name}"? ${room.deviceCount > 0 ? `${room.deviceCount} device(s) will become unassigned.` : "This cannot be undone."}`,
            onConfirm: () => {
                // replace with API call to backend
                setRooms((prev) => prev.filter((r) => r.id !== room.id));
                setToast({ message: `"${room.name}" deleted.` });
                closeConfirm();
            }
        });
    };
 
    const handleAddRoom = () => {
        const trimmed = newRoomName.trim();
        if (!trimmed) return;
        // replace with API call to backend
        const newRoom = {
            id: `r-${Date.now()}`,
            name: trimmed,
            deviceCount: 0,
        };
        setRooms((prev) => [...prev, newRoom]);
        setToast({ message: `"${trimmed}" added.` });
        setNewRoomName("");
        setIsAddingRoom(false);
    };

    const admins = users.filter((u) => u.role === "admin");

    return (
        <>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            <Header
                title="Admin Panel"
                subtitle={`${users.length} total user(s) · ${admins.length} admin(s)`}
                icon={<Settings className="w-6 h-6 text-white"/>}
                onLogout={onLogout}
                actions={
                    <Button
                        text="Back to Overview"
                        icon={<LayoutDashboard className="w-4 h-4"/>}
                        onClick={() => navigate("/overview")}
                        variant="ghost"
                    />
                }
            />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* user management section */}
                <section>
                    <h2 className="text-sm font-semibold m-4 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        User Management
                    </h2>
                    <div className="space-y-3">
                        {users.map((u) => (
                            <UserNameplate
                                key={u.id}
                                user={u}
                                currentUser={currentUser}
                                onUpgrade={handleUpgrade}
                                onDowngrade={handleDowngrade}
                                onDelete={handleDeleteUser}
                                onClick={() => setIsUserModalOpen(true)} 
                            />
                        ))}
                    </div>
                </section>
                {/* room management section */}
                <section>
                    <div className="flex items-center justify-between my-4">
                        <h2 className="text-sm font-semibold m-4 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Room Management
                        </h2>
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
                    <div>
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
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Room name"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    onKeyDown={handleAddRoomKeyDown}
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
                </section>
            </main>
        </div>

        {/* This Modal should be replaced with the UserModal */ }
        <Modal
            isOpen={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            title={"User Modal placeholder"}
        >
            <span className="text-gray-700 dark:text-gray-300">Some modal content</span>
        </Modal>
    
        {toast && (
            <Toast message={toast.message} onDismiss={() => setToast(null)} />
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