import { useState } from "react";

export function useAddressModal() {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (state: boolean) => {
    setIsOpen(state);
  };

  return {
    isOpen,
    onOpenChange,
  };
}
