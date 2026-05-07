import Header from "../components/dashboard/Header";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import UserNameplate from "../components/admin/UserNameplate";
import RoomPlate from "../components/admin/RoomPlate";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LayoutDashboard, Plus, X } from "lucide-react";
import Input from "../components/common/Input";

export default function AdminPanel({ send, users, rooms, currentUser, onUsersChange, onLogout }) {
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const navigate = useNavigate();

    // fetch users and rooms
    useEffect(() => {
        send.getUsers();
        send.getRooms();
    }, [])

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
            onConfirm: () => {
                send.demote(user.username);
                setToast({ message: `${user.username} successfully demoted to User.` });
                closeConfirm();   
            }
        });
    }

    const handleUpgrade = (user) => {
        openConfirm({
            title: "Promote to Admin",
            message: `Promote ${user.username} to Admin? Access to admin features will be granted.`,
            onConfirm: () => {
                send.promote(user.username);
                setToast({ message: `${user.username} successfully promoted to Admin.` });
                closeConfirm();   
            }
        });
    }

    const handleDeleteUser = (user) => {
        openConfirm({
            title: "Delete User",
            message: `Delete ${user.username} permanently? This cannot be undone.`,
            onConfirm: () => {
                send.deleteUser(user.username);
                setToast({ message: `${user.username} successfully deleted from users.` });
                closeConfirm();   
            }
        });
    }

    // room handlers
    const handleRenameRoom = (roomId, newName) => {
        send.renameRoom(roomId, newName),
        setToast({ message: `Room renamed to "${newName}".` });
    };
 
    const handleDeleteRoom = (room) => {
        // TODO: get devices associated with the room to show deviceCount in message
        openConfirm({
            title: "Delete Room",
            message: `Delete "${room.name}"? ${room.deviceCount > 0 ? `${room.deviceCount} device(s) will become unassigned.` : "This cannot be undone."}`,
            onConfirm: () => {
                send.deleteRoom(room.id);
                setToast({ message: `"${room.name}" deleted.` });
                closeConfirm();
            }
        });
    };
 
    const handleAddRoom = () => {
        const trimmed = newRoomName.trim();
        if (!trimmed) return;
        send.createRoom(newRoomName);
        setToast({ message: `"${trimmed}" added.` });
        setNewRoomName("");
        setIsAddingRoom(false);
    };

    const roomSort = (a, b) => a.name - b.name;
    const userSort = (a, b) => a.username - b.username;

    const admins = users.sort(userSort).filter((u) => u.type === "admin");

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
                        {users?.sort(userSort).map((u) => (
                            <UserNameplate
                                key={u.id}
                                user={u}
                                //currentUser={currentUser}
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
                        {rooms.sort(roomSort).map((room) => (
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