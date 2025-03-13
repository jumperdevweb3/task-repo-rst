import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Control,
  Controller,
  FieldErrors,
  FieldPath,
  UseFormRegister,
} from "react-hook-form";

interface IFormFieldProps {
  id: FieldPath<AddressFormValues>;
  label: string;
  register: UseFormRegister<AddressFormValues>;
  errors: FieldErrors<AddressFormValues>;
  control?: Control<AddressFormValues>;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
}

export function AddressFormField({
  id,
  label,
  register,
  errors,
  control,
  type = "text",
  disabled,
}: IFormFieldProps) {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor={id} className="text-right mt-2">
        {label} *
      </Label>
      <div className="col-span-3 space-y-1">
        {type === "date" ? (
          <Controller
            render={({ field }) => {
              return (
                <Input
                  id={id}
                  type={type}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : new Date(field.value).toISOString().split("T")[0]
                  }
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={disabled}
                />
              );
            }}
            name={id}
            control={control}
          />
        ) : (
          <Input
            id={id}
            type={type}
            disabled={disabled}
            {...register(
              id,
              type === "date" ? { valueAsDate: true } : undefined,
            )}
          />
        )}

        {errors[id] && (
          <p className="text-red-500 text-sm">{errors[id].message}</p>
        )}
      </div>
    </div>
  );
}
