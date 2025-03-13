import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { AddressModal } from "@/components/user-addresses/address-modal/address-modal";
import { useAddressModal } from "@/hooks/useAddressModal";
import { KeyedMutator } from "swr";
import { deleteUserAddress } from "@/api/user-addresses";
import { HandleErrorMessage } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";

interface IUserAddressTableRowProps {
  address: UserAddress;
  mutateAddresses: KeyedMutator<PaginatedUserAddresses>;
}
export function UserAddressTableRow({
  address,
  mutateAddresses,
}: IUserAddressTableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpenChange } = useAddressModal();

  const onAddressDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteUserAddress({
        user_id: address.user_id,
        address_type: address.address_type,
        valid_from: new Date(address.valid_from),
      });
      await mutateAddresses();
      toast.success("Address deleted successfully");
    } catch (e) {
      HandleErrorMessage(e, "Address delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TableRow
      key={`${address.user_id}-${address.address_type}-${address.valid_from}`}
    >
      <TableCell>
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {address.address_type}
        </span>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <p>
            {address.street} {address.building_number}
          </p>
          <p>
            {address.post_code} {address.city}
          </p>
          <p>{address.country_code}</p>
        </div>
      </TableCell>
      <TableCell>{new Date(address.valid_from).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(address.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onOpenChange(true)}
              disabled={isDeleting}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={onAddressDelete}
              disabled={isDeleting}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      {isOpen && (
        <AddressModal
          userId={address.user_id}
          defaultValues={address}
          mutateAddresses={mutateAddresses}
          mode="edit"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </TableRow>
  );
}
