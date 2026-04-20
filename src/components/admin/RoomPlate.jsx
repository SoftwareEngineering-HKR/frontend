import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { Pencil, Trash2, Check, X } from "lucide-react";

export default function RoomPlate({ room, onRename, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(room.name);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== room) onRename(room, trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(room);
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-14 items-center justify-between gap-4 px-5 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md">
      {isEditing ? (
        <>
          <div className="flex-1">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Room name"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="primary"
              icon={<Check className="w-4 h-4" />}
              onClick={handleSave}
              disabled={!value.trim()}
              title="Save"
            />
            <Button
              variant="ghost"
              icon={<X className="w-4 h-4" />}
              onClick={handleCancel}
              title="Cancel"
            />
          </div>
        </>
      ) : (
        <>
          <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {room.name}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              icon={<Pencil className="w-4 h-4" />}
              onClick={() => setIsEditing(true)}
              title="Rename room"
            />
            <Button
              variant="danger"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => onDelete(room)}
              title="Delete room"
            />
          </div>
        </>
      )}
    </div>
  );
}