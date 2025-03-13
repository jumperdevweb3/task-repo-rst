"use server";
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
} from "@/components/users/settings";
import { users, users_addresses } from "@/prisma/models";
import { Prisma } from "@prisma/client";
import { HandleThrowError } from "@/lib/utils";
import prisma from "@/prisma/prisma";

// Message 🙌
// Due to init database schema where users_addresses column has unique key created from user_id, address_type and valid_from
// where valid_from is timestamp with microseconds
// I had to use prisma.$queryRaw & date_trunc to compare the timestamp in shortest way

export async function getUserAddresses(
  userId: number,
  params?: {
    page?: number;
    itemsPerPage?: number;
  },
): Promise<PaginatedUserAddresses> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const page = params?.page || DEFAULT_PAGE;
    const itemsPerPage = params?.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;

    const skip = (page - 1) * itemsPerPage;

    const data = (await users_addresses.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: itemsPerPage,
    })) as UserAddress[];

    const totalItems = await users_addresses.count({
      where: { user_id: userId },
    });

    return {
      data,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
        currentPage: page,
        itemsPerPage,
      },
    };
  } catch (e) {
    throw HandleThrowError(e);
  }
}

export async function createUserAddress(
  userId: number,
  address: Omit<Prisma.users_addressesCreateInput, "users">,
): Promise<UserAddress> {
  try {
    const userData = await users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userData) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const findUniqueAddress = await prisma.$queryRaw`
      SELECT * FROM users_addresses
      WHERE user_id = ${userId}
        AND address_type = ${address.address_type}
        AND DATE_TRUNC('second', valid_from) = DATE_TRUNC('second', ${address.valid_from})
    `;

    if (findUniqueAddress && findUniqueAddress.length > 0) {
      throw new Error(
        `${address.address_type} Address with date ${new Date(address.valid_from).toLocaleDateString()} already exists`,
      );
    }

    return users_addresses.create({
      data: {
        ...address,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    }) as Promise<UserAddress>;
  } catch (e) {
    throw HandleThrowError(e);
  }
}

export async function updateUserAddress(
  user_id_address_type_valid_from: {
    user_id: number;
    address_type: AddressType;
    valid_from: Date;
  },
  address: Omit<Prisma.users_addressesUpdateInput, "users">,
): Promise<UserAddress> {
  try {
    const { user_id, address_type, valid_from } =
      user_id_address_type_valid_from;

    const userData = await users.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!userData) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    const findItemToUpdate = await prisma.$queryRaw`
      SELECT * FROM users_addresses
      WHERE user_id = ${user_id}
        AND address_type = ${address_type}
        AND DATE_TRUNC('second', valid_from) = DATE_TRUNC('second', ${valid_from})
    `;

    if (!findItemToUpdate || findItemToUpdate.length === 0) {
      throw new Error(
        `Address with type ${address_type} and date ${new Date(valid_from).toLocaleDateString()} not found for user with ID ${user_id}`,
      );
    }

    const exactRecord = findItemToUpdate[0];

    const updateResult = await prisma.$executeRaw`
      UPDATE users_addresses
      SET 
        street = ${address.street},
        building_number = ${address.building_number},
        post_code = ${address.post_code},
        city = ${address.city},
        country_code = ${address.country_code},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${exactRecord.user_id}
        AND address_type = ${exactRecord.address_type}
        AND DATE_TRUNC('second', valid_from) = DATE_TRUNC('second', ${user_id_address_type_valid_from.valid_from})
    `;

    if (updateResult === 0) {
      throw new Error("Failed to update address even with exact timestamp");
    }

    const updatedRecord = await prisma.$queryRaw`
      SELECT * FROM users_addresses
      WHERE user_id = ${exactRecord.user_id}
        AND address_type = ${exactRecord.address_type}
        AND DATE_TRUNC('second', valid_from) = DATE_TRUNC('second', ${user_id_address_type_valid_from.valid_from})
    `;

    return updatedRecord[0] as UserAddress;
  } catch (e) {
    throw HandleThrowError(e);
  }
}

export async function deleteUserAddress(user_id_address_type_valid_from: {
  user_id: number;
  address_type: AddressType;
  valid_from: Date;
}): Promise<any> {
  try {
    const exactRecords = await prisma.$queryRaw`
        SELECT user_id, address_type, valid_from
        FROM users_addresses
        WHERE user_id = ${user_id_address_type_valid_from.user_id}
          AND address_type = ${user_id_address_type_valid_from.address_type}
          AND DATE_TRUNC('second', valid_from) = DATE_TRUNC('second', ${user_id_address_type_valid_from.valid_from})
    `;

    if (!exactRecords || exactRecords.length === 0) {
      throw new Error(
        `Address with type ${user_id_address_type_valid_from.address_type} and date ${new Date(user_id_address_type_valid_from.valid_from).toLocaleDateString()} not found for user with ID ${user_id_address_type_valid_from.user_id}`,
      );
    }

    const exactRecord = exactRecords[0];

    const deleteResult = await prisma.$executeRaw`
      DELETE FROM users_addresses 
      WHERE user_id = ${exactRecord.user_id}
      AND address_type = ${exactRecord.address_type}
      AND DATE_TRUNC('second', valid_from) = DATE_TRUNC('second', ${user_id_address_type_valid_from.valid_from})
    `;

    if (deleteResult === 0) {
      throw new Error("Failed to delete address even with exact timestamp");
    }

    return { count: deleteResult };
  } catch (e) {
    console.error("Delete error:", e);
    throw HandleThrowError(e);
  }
}
