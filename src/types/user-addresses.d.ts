import { users_addresses } from "@prisma/client";
import { z } from "zod";
import {
  createAddressSchema,
  editAddressSchema,
} from "@/components/user-addresses/address-modal/schema";

declare global {
  type AddressType = "HOME" | "INVOICE" | "POST" | "WORK";
  type UserAddress = users_addresses & { address_type: AddressType };

  type PaginatedUserAddresses = {
    data: UserAddress[];
    pagination: PaginationInfo;
  };

  type CreateAddressFormValues = z.infer<typeof createAddressSchema>;
  type UpdateAddressFormValues = z.infer<typeof editAddressSchema>;

  type AddressFormValues = CreateAddressFormValues | UpdateAddressFormValues;
}

export {};
