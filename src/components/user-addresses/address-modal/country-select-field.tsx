import React, { memo, useMemo } from "react";
import iso from "iso-3166-1";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface ICountrySelectFieldProps {
  control: Control<AddressFormValues>;
  errors: FieldErrors<AddressFormValues>;
}
const countries = iso.all();
export const CountrySelectField = memo(
  ({ control, errors }: ICountrySelectFieldProps) => {
    const countryItems = useMemo(
      () =>
        countries.map((item) => (
          <SelectItem key={item.alpha3} value={item.alpha3}>
            {item.country}
          </SelectItem>
        )),
      [errors],
    );

    return (
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="country_code" className="text-right mt-2">
          Country Code *
        </Label>
        <div className="col-span-3 space-y-1">
          <Controller
            name="country_code"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>{countryItems}</SelectContent>
              </Select>
            )}
          />
          {errors.country_code && (
            <p className="text-red-500 text-sm">
              {errors.country_code.message}
            </p>
          )}
        </div>
      </div>
    );
  },
);
