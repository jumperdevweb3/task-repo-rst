import { users } from "@prisma/client";

declare global {
  type UserStatus = "ACTIVE" | "INACTIVE";

  type UserData = users;

  type PaginationInfo = {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };

  type PaginatedUsers = {
    data: UserData[];
    pagination: PaginationInfo;
  };
}

export {};
