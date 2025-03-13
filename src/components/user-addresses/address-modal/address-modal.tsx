"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddressPreview } from "./address-preview";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAddressSchema,
  editAddressSchema,
} from "@/components/user-addresses/address-modal/schema";
import { AddressTypeField } from "@/components/user-addresses/address-modal/address-type-field";
import { CountrySelectField } from "@/components/user-addresses/address-modal/country-select-field";
import { AddressFormField } from "@/components/user-addresses/address-modal/form-field";
import { createUserAddress, updateUserAddress } from "@/api/user-addresses";
import { KeyedMutator } from "swr";
import { toast } from "react-toastify";
import { HandleErrorMessage } from "@/lib/utils";
import { getDefaultValues } from "@/components/user-addresses/address-modal/getDefaultValues";

interface AddressModalProps {
  userId: number;
  mutateAddresses: KeyedMutator<PaginatedUserAddresses>;
  defaultValues?: UserAddress;
  mode: "create" | "edit";
  isOpen: boolean;
  onOpenChange: (state: boolean) => void;
}

export function AddressModal({
  userId,
  mutateAddresses,
  defaultValues,
  mode = "create",
  isOpen,
  onOpenChange,
}: AddressModalProps) {
  const defaultValuesFormatted = getDefaultValues(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit";

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(isEditMode ? editAddressSchema : createAddressSchema),
    defaultValues: {
      ...(!!defaultValues
        ? defaultValuesFormatted
        : { valid_from: new Date() }),
    },
  });

  const formData = watch();

  useEffect(() => {
    if (isOpen && isEditMode && defaultValuesFormatted) {
      reset(defaultValuesFormatted);
    }
  }, [defaultValues]);

  const onOpenChangeController = (state: boolean) => {
    if (!isSubmitting) {
      if (!state) {
        reset();
      }
      onOpenChange(state);
    }
  };

  const onSubmit = async (data: AddressFormValues) => {
    try {
      setIsSubmitting(true);

      if (
        isEditMode &&
        !!defaultValues?.address_type &&
        !!defaultValues?.valid_from &&
        !!defaultValues?.user_id
      ) {
        await updateUserAddress(
          {
            user_id: userId,
            address_type: data.address_type,
            valid_from: data.valid_from,
          },
          data as UpdateAddressFormValues,
        );
        await mutateAddresses();
        toast.success("Address updated successfully");
      } else {
        await createUserAddress(userId, data as CreateAddressFormValues);
        await mutateAddresses();
        toast.success("Address created successfully");
      }

      onOpenChangeController(false);
    } catch (e) {
      HandleErrorMessage(
        e,
        isEditMode ? "Failed to update address" : "Failed to create address",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeController}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <AddressTypeField control={control as any} errors={errors} />

            <AddressFormField
              id="valid_from"
              label="Valid From"
              register={register}
              errors={errors}
              type="date"
              control={control}
            />

            <AddressFormField
              id="street"
              label="Street"
              register={register}
              errors={errors}
            />

            <AddressFormField
              id="building_number"
              label="Building Number"
              register={register}
              errors={errors}
            />

            <AddressFormField
              id="post_code"
              label="Post Code"
              register={register}
              errors={errors}
            />

            <AddressFormField
              id="city"
              label="City"
              register={register}
              errors={errors}
            />

            <CountrySelectField control={control as any} errors={errors} />

            <div className="col-span-full mt-4">
              <AddressPreview address={formData} />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChangeController(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : isEditMode
                  ? "Update Address"
                  : "Create Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
