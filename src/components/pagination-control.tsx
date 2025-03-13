"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { JSX, useEffect, useRef } from "react";

interface PaginationControlProps {
  totalPages: number;
  currentPage: number;
  baseUrl?: string;
  keyPrefix?: string;
  extraParams?: Record<string, string>;
  contextKey?: string;
}

export function PaginationControl({
  totalPages,
  currentPage,
  baseUrl = "",
  keyPrefix = "page",
  extraParams = {},
  contextKey = "",
}: PaginationControlProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);
  const lastPushRef = useRef("");

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(keyPrefix, page.toString());

    Object.entries(extraParams).forEach(([key, value]) => {
      params.set(key, value);
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      const url = createPageUrl(page);

      if (url !== lastPushRef.current) {
        lastPushRef.current = url;
        router.push(url);
      }
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (totalPages === 0) return;

    if (currentPage > totalPages) {
      const url = createPageUrl(totalPages);

      if (url !== lastPushRef.current) {
        lastPushRef.current = url;
        router.push(url);
      }
    }

    if (currentPage < 1 && totalPages > 0) {
      const url = createPageUrl(1);

      if (url !== lastPushRef.current) {
        lastPushRef.current = url;
        router.push(url);
      }
    }
  }, [contextKey, totalPages]);

  const showPages = () => {
    const pages: JSX.Element[] = [];
    const pagesAround = 2;

    if (totalPages === 0) return [];

    let startPage = Math.max(1, currentPage - pagesAround);
    let endPage = Math.min(totalPages, currentPage + pagesAround);

    if (startPage > 1) {
      pages.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>,
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <span className="px-2">...</span>
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <span className="px-2">...</span>
          </PaginationItem>,
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {showPages()}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            className={
              currentPage === totalPages || totalPages === 0
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
