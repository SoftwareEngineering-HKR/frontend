import { Crown, User } from "lucide-react";

export default function RoleTag({ role }) {
    // admin tag
    if (role === "admin") {
        return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
            <Crown className="w-3 h-3" />
            Admin
        </span>
        );
    }
    // normal user tags
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
        <User className="w-3 h-3" />
        User
        </span>
    );
}