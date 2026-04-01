import Header from "../components/dashboard/Header";
import Button from "../components/common/Button";
import Toast from "../components/common/Toast";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import UserNameplate from "../components/admin/UserNameplate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LayoutDashboard } from "lucide-react";

export default function AdminPanel({ users, currentUser, onUsersChange }) {
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
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

    return (
        <>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            <Header
                title="Admin Panel"
                subtitle={`${users.length} total user(s) · ${admins.length} admin(s)`}
                icon={<Settings className="w-6 h-6 text-white"/>}
                actions={
                    <Button
                        text="Back to Overview"
                        icon={<LayoutDashboard className="w-4 h-4"/>}
                        onClick={() => navigate("//overview")}
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
                                onClick={() => setIsUserModalOpen(true)} 
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