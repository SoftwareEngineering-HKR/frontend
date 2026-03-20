import { Crown } from "lucide-react";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";

export default function AdminPanel() {
    return (
        <>
        <Button
          text="I am an admin"
          icon={<Crown />}
          onClick={() => {}}
        />
        </>
    );
}