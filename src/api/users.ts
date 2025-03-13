"use server";
import { users } from "@/prisma/models";
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
} from "@/components/users/settings";
import { HandleThrowError } from "@/lib/utils";

export async function getUsers(params?: {
  page?: number;
  itemsPerPage?: number;
}): Promise<PaginatedUsers> {
  try {
    const page = params?.page || DEFAULT_PAGE;
    const itemsPerPage = params?.itemsPerPage || DEFAULT_ITEMS_PER_PAGE;

    const skip = (page - 1) * itemsPerPage;

    const data = await users.findMany({
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: itemsPerPage,
    });

    const totalItems = await users.count();

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
