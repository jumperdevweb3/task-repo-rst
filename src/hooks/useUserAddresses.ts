"use client";
import useSWR from "swr";
import { getUserAddresses } from "@/api/user-addresses";
import { usePaginatedEntity } from "@/hooks/usePaginationEntity";

export function useUserAddresses(
  userId: number,
  page: number = 1,
  itemsPerPage: number = 10,
) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? [`userAddresses_${userId}`, page, itemsPerPage] : null,
    () => getUserAddresses(userId, { page, itemsPerPage }),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 5000,
    },
  );

  usePaginatedEntity({
    data,
    pageParamName: "addressPage",
    entityIdParam: "userId",
    entityId: userId,
    getPaginationInfo: (data) => data?.pagination,
  });

  return {
    addresses: data,
    isLoading,
    isError: error,
    mutate,
  };
}
