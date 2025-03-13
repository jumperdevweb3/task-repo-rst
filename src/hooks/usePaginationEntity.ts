"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface IUsePaginatedEntityProps<T> {
  data: T | undefined;
  pageParamName: string;
  entityIdParam?: string;
  entityId?: number | null;
  defaultPage?: number;
  getPaginationInfo: (data: T) => { totalPages: number } | undefined;
}

export function usePaginatedEntity<T>({
  data,
  pageParamName,
  entityIdParam,
  entityId,
  defaultPage = 1,
  getPaginationInfo,
}: IUsePaginatedEntityProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = searchParams.get(pageParamName)
    ? parseInt(searchParams.get(pageParamName)!)
    : defaultPage;

  useEffect(() => {
    if (!data) return;

    const paginationInfo = getPaginationInfo(data);
    if (!paginationInfo) return;

    const { totalPages } = paginationInfo;

    if (
      currentPage > totalPages &&
      totalPages > 0 &&
      currentPage !== defaultPage
    ) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(pageParamName, totalPages.toString());

      if (entityIdParam && entityId) {
        params.set(entityIdParam, entityId.toString());
      }

      router.push(`?${params.toString()}`);
    }
  }, [
    data,
    currentPage,
    router,
    searchParams,
    pageParamName,
    entityIdParam,
    entityId,
    defaultPage,
    getPaginationInfo,
  ]);

  return {
    currentPage,
  };
}
