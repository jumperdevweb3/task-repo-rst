import React, { memo } from "react";
import { Label } from "@/components/ui/label";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const addressTypeSelectFields: { value: AddressType; label: string }[] = [
  { value: "HOME", label: "Home" },
  { value: "INVOICE", label: "Invoice" },
  { value: "POST", label: "Post" },
  { value: "WORK", label: "Work" },
];

interface IAddressTypeFieldProps {
  control: Control<AddressFormValues>;
  errors: FieldErrors<AddressFormValues>;
}

export const AddressTypeField = memo(
  ({ control, errors }: IAddressTypeFieldProps) => (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor="address_type" className="text-right mt-2">
        Address Type *
      </Label>
      <div className="col-span-3 space-y-1">
        <Controller
          name="address_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {addressTypeSelectFields.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.address_type && (
          <p className="text-red-500 text-sm">{errors.address_type.message}</p>
        )}
      </div>
    </div>
  ),
);
