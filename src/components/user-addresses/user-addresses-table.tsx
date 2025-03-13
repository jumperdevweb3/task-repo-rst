import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAddressTableRow } from "@/components/user-addresses/user-address-table-row";
import { KeyedMutator } from "swr";

export function UserAddressesTable({
  userAddresses,
  mutateAddresses,
}: {
  userAddresses: UserAddress[];
  mutateAddresses: KeyedMutator<PaginatedUserAddresses>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Valid From</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userAddresses.map((address) => (
          <UserAddressTableRow
            mutateAddresses={mutateAddresses}
            address={address}
            key={`${address.user_id}-${address.address_type}-${address.valid_from}`}
          />
        ))}
      </TableBody>
    </Table>
  );
}
