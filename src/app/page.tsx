import { Users } from "@/components/users/users";
import { getUsers } from "@/api/users";
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
} from "@/components/users/settings";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ usersPage?: string; itemsPerPage?: string }>;
}) {
  const params = await searchParams;
  const page = params.usersPage ? parseInt(params.usersPage) : DEFAULT_PAGE;
  const itemsPerPage = params.itemsPerPage
    ? parseInt(params.itemsPerPage)
    : DEFAULT_ITEMS_PER_PAGE;

  const paginatedUsers = await getUsers({ page, itemsPerPage });

  return (
    <main className="flex flex-col gap-10 min-h-screen justify-center items-center py-8 px-4">
      <p className="text-gray-400">* (M) - mocked</p>

      <Users paginatedUsers={paginatedUsers} />
    </main>
  );
}
