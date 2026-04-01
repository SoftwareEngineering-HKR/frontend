import Button from "../common/Button";
import RoleTag from "./RoleTag";
import { CircleArrowUp, CircleArrowDown, Trash2 } from "lucide-react";

export default function UserNameplate({ user, onUpgrade, onDowngrade, onDelete, currentUser, onClick }) {
    const isMe = user === currentUser;

    return (
        <>
        <div
            className="flex min-h-20 justify-between gap-4 px-5 py-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm
            hover:shadow-md hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            onClick={onClick}
        >
            <div className="flex items-center min-w-0 space-x-2">
                <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                        {user.name}
                    </span>
                    {isMe && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">(you)</span>
                    )}
                </div>
                <div className="mt-0.5">
                    <RoleTag role={user.role}/>
                </div>
            </div>
            {/* only show buttons for other people, not myself */}
            {!isMe && (
                <div className="flex items-center gap-3 flex-shrink-0">
                    {user.role === "user" && (
                        <Button
                        variant="primary"
                        icon={<CircleArrowUp className="w-4 h-4"/>}
                        onClick={(e) => {e.stopPropagation(); onUpgrade(user);}}
                        title="Promote to Admin"
                        />
                    )}
                    {user.role === "admin" && (
                        <Button
                        variant="primary"
                        icon={<CircleArrowDown className="w-4 h-4"/>}
                        onClick={(e) => {e.stopPropagation(); onDowngrade(user);}}
                        title="Demote to User"
                        />
                    )}
                    <Button
                        variant="danger"
                        icon={<Trash2 className="w-4 h-4"/>}
                        onClick={(e) => {e.stopPropagation(); onDelete(user);}}
                        title="Delete User"
                    />
                </div>
            )}
        </div>
        </>
    )

}