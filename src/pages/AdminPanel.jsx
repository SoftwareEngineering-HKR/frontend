import Header from "../components/dashboard/Header";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import ConfirmDialog from "../components/common/ConfirmDialog";
import UserNameplate from "../components/admin/UserNameplate";
import UserModal from "../components/admin/UserModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LayoutDashboard } from "lucide-react";

export default function AdminPanel({ users, currentUser, onUsersChange, onLogout, allDevices }) {
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;
    const selectedUserDeviceIds = selectedUser?.devices?.map((device) => device.id) ?? [];
    const availableDevices = selectedUser
        ? allDevices
            .filter((device) => !selectedUserDeviceIds.includes(device.id))
            .map((device) => {
                const owner = users.find((user) =>
                    user.devices?.some((assigned) => assigned.id === device.id),
                );
                return { ...device, ownerName: owner?.name };
            })
        : [];

    const handleAssignDevice = (device) => {
        if (!selectedUser) return;

        onUsersChange((prev) =>
            prev.map((user) => {
                if (user.id === selectedUser.id) {
                    return {
                        ...user,
                        devices: [...(user.devices || []), device],
                    };
                }

                if (user.devices?.some((assigned) => assigned.id === device.id)) {
                    return {
                        ...user,
                        devices: user.devices.filter((assigned) => assigned.id !== device.id),
                    };
                }

                return user;
            }),
        );

        setToast({ message: `${device.name} assigned to ${selectedUser.name}.` });
    };

    const handleUnassignDevice = (device) => {
        if (!selectedUser) return;

        onUsersChange((prev) =>
            prev.map((user) =>
                user.id === selectedUser.id
                    ? {
                          ...user,
                          devices: (user.devices || []).filter((assigned) => assigned.id !== device.id),
                      }
                    : user,
            ),
        );

        setToast({ message: `${device.name} unassigned from ${selectedUser.name}.` });
    };

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

    const handleDelete = (user) => {
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

    const admins = users.filter((u) => u.role === "admin");

    const openUserModal = (user) => {
        setSelectedUserId(user.id);
        setIsUserModalOpen(true);
    };

    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setSelectedUserId(null);
    };

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
                                onDelete={handleDelete}
                                onClick={() => openUserModal(u)}
                            />
                        ))}
                    </div>
                </section>
                {/* for room operations later maybe? */}
                {/* <section>
                    <h2 className="text-sm font-semibold m-4 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Room Management
                    </h2>
                </section> */}
            </main>
        </div>

        <UserModal
            isOpen={isUserModalOpen}
            onClose={closeUserModal}
            user={selectedUser}
            availableDevices={availableDevices}
            currentUser={currentUser}
            onUpgrade={handleUpgrade}
            onDowngrade={handleDowngrade}
            onDelete={handleDelete}
            onAssign={handleAssignDevice}
            onUnassign={handleUnassignDevice}
        />
    
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