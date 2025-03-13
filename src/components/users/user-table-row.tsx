import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface IUserTableRowProps {
  isSelected: boolean;
  user: UserData;
  handleUserSelect: (userId: number) => void;
}
export function UserTableRow({
  isSelected,
  user,
  handleUserSelect,
}: IUserTableRowProps) {
  return (
    <TableRow
      className={isSelected ? "bg-muted/50" : "" + "cursor-pointer"}
      onClick={() => handleUserSelect(user.id)}
    >
      <TableCell className="font-medium">
        {user.first_name} {user.last_name}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            user.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.status}
        </span>
      </TableCell>
      <TableCell>{user.created_at.toLocaleDateString()}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
              console.log("Mock Trigger Clicked");
            }}
          >
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                console.log("Mock Edit Clicked");
              }}
            >
              Edit (M)
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Mock Delete Clicked");
              }}
            >
              Delete (M)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
