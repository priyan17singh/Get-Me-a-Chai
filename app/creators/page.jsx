import SearchUser from "@/components/SearchUsers";

export default function AllUsersPage() {
  return (
    <div className="pt-10">
      <h2 className="text-center text-white text-xl font-bold mb-4">
        All Registered Users
      </h2>
      <SearchUser showAllInitially={true} />
    </div>
  );
}
