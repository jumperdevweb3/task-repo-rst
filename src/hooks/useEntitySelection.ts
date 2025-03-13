"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface IUseEntitySelectionProps {
  entityParam: string;
  relatedParams?: string[];
}

export function useEntitySelection({
  entityParam,
  relatedParams = [],
}: IUseEntitySelectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const existingEntityId = searchParams.get(entityParam);
  const initialEntityId = existingEntityId ? parseInt(existingEntityId) : null;

  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(
    initialEntityId,
  );
  const isInitialMount = useRef(true);
  const prevEntityId = useRef<number | null>(null);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevEntityId.current = selectedEntityId;
      return;
    }

    if (prevEntityId.current === selectedEntityId) {
      return;
    }

    prevEntityId.current = selectedEntityId;
    const params = new URLSearchParams(searchParams.toString());

    if (selectedEntityId === null) {
      if (params.has(entityParam)) {
        params.delete(entityParam);

        relatedParams.forEach((param) => {
          if (params.has(param)) {
            params.delete(param);
          }
        });

        router.push(`?${params.toString()}`);
      }
    } else {
      params.set(entityParam, selectedEntityId.toString());

      relatedParams.forEach((param) => {
        if (params.has(param)) {
          params.delete(param);
        }
      });

      router.push(`?${params.toString()}`);
    }
  }, [selectedEntityId, router, searchParams, entityParam, relatedParams]);

  const handleEntitySelect = (entityId: number) => {
    setSelectedEntityId((prev) => (prev === entityId ? null : entityId));
  };

  return {
    selectedEntityId,
    setSelectedEntityId,
    handleEntitySelect,
  };
}
