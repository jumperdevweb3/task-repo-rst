import { UserAddressesTable } from "@/components/user-addresses/user-addresses-table";
import { PaginationControl } from "@/components/pagination-control";
import { useUserAddresses } from "@/hooks/useUserAddresses";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { useAddressModal } from "@/hooks/useAddressModal";
import { AddressModal } from "@/components/user-addresses/address-modal/address-modal";
import { Skeleton } from "@/components/ui/skeleton";

interface UserAddressesProps {
  selectedUserId: number;
}

export function UserAddresses({ selectedUserId }: UserAddressesProps) {
  const { isOpen, onOpenChange } = useAddressModal();
  const searchParams = useSearchParams();

  const addressPage = searchParams.get("addressPage")
    ? parseInt(searchParams.get("addressPage")!)
    : 1;

  const {
    addresses,
    isLoading,
    isError,
    mutate: mutateAddresses,
  } = useUserAddresses(selectedUserId, addressPage, 3);

  const pagination = addresses?.pagination;
  const userAddresses = addresses?.data || [];

  return (
    <div className="space-y-6 mt-8 border-t pt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Addresses</h2>
        <Button onClick={() => onOpenChange(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Address
        </Button>
      </div>

      <AddressModal
        userId={selectedUserId}
        mutateAddresses={mutateAddresses}
        mode="create"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />

      {isLoading ? (
        <div className="flex gap-2 flex-col">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      ) : isError ? (
        <div className="py-8 text-center text-red-500">
          Error loading addresses. Please try again.
        </div>
      ) : userAddresses.length > 0 ? (
        <>
          <div className="rounded-md border">
            <UserAddressesTable
              userAddresses={userAddresses}
              mutateAddresses={mutateAddresses}
            />
          </div>

          <PaginationControl
            totalPages={pagination?.totalPages || 0}
            currentPage={addressPage}
            keyPrefix="addressPage"
            extraParams={{ userId: selectedUserId.toString() }}
            contextKey={`userId_${selectedUserId}`}
          />
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No addresses found for this user.
        </div>
      )}
    </div>
  );
}
