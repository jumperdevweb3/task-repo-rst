"use client";

import React from "react";
import { UsersTable } from "@/components/users/users-table";
import { PaginationControl } from "@/components/pagination-control";
import { UserAddresses } from "@/components/user-addresses/user-addresses";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEntitySelection } from "@/hooks/useEntitySelection";

interface IUsersProps {
  paginatedUsers: PaginatedUsers;
}

export function Users({ paginatedUsers }: IUsersProps) {
  const { data: users, pagination } = paginatedUsers;
  const { totalPages, currentPage, itemsPerPage } = pagination;

  const { selectedEntityId: selectedUserId, handleEntitySelect } =
    useEntitySelection({
      entityParam: "userId",
      relatedParams: ["addressPage"],
    });

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <Button onClick={() => console.log("Create User Mock")}>
          <Plus className="mr-2 h-4 w-4" /> Create User (M)
        </Button>
      </div>

      <div className="rounded-md border">
        <UsersTable
          users={users}
          handleUserSelect={handleEntitySelect}
          selectedUserId={selectedUserId}
        />
      </div>

      <PaginationControl
        totalPages={totalPages}
        currentPage={currentPage}
        keyPrefix="usersPage"
        extraParams={
          selectedUserId
            ? {
                itemsPerPage: itemsPerPage.toString(),
                userId: selectedUserId.toString(),
              }
            : { itemsPerPage: itemsPerPage.toString() }
        }
      />

      {!!selectedUserId && <UserAddresses selectedUserId={selectedUserId} />}
    </div>
  );
}
