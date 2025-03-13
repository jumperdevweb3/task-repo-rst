export function getDefaultValues(defaultValues: UserAddress | undefined) {
  if (!defaultValues) {
    return null;
  }

  return {
    address_type: defaultValues.address_type,
    valid_from: defaultValues.valid_from,
    street: defaultValues.street,
    building_number: defaultValues.building_number,
    post_code: defaultValues.post_code,
    city: defaultValues.city,
    country_code: defaultValues.country_code,
  };
}
