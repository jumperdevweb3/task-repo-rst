import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTableRow } from "@/components/users/user-table-row";

interface IUsersTableProps {
  users: UserData[];
  handleUserSelect: (userId: number) => void;
  selectedUserId: number | null;
}

export function UsersTable({
  users,
  handleUserSelect,
  selectedUserId,
}: IUsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isSelected = selectedUserId === user.id;
          return (
            <UserTableRow
              isSelected={isSelected}
              handleUserSelect={handleUserSelect}
              user={user}
              key={user.id}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}
