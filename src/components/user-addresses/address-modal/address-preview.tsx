"use client";

interface IAddressPreviewProps {
  address: AddressFormValues;
}

export function AddressPreview({ address }: IAddressPreviewProps) {
  const hasAddressData =
    address.street ||
    address.building_number ||
    address.post_code ||
    address.city ||
    address.country_code;

  if (!hasAddressData) {
    return null;
  }

  return (
    <div className="border rounded-md p-4 bg-muted/50">
      <h3 className="font-medium mb-2">Address Preview</h3>
      <div className="text-sm">
        <p>
          {address.street} {address.building_number}
        </p>
        <p>
          {address.post_code} {address.city}
        </p>
        <p>{address.country_code}</p>
      </div>
    </div>
  );
}
