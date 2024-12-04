"use client";
import { useState, useEffect } from "react";
import {
  SelectGroup,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface User {
  _id: string;
  username: string;
  userId: string;
  phoneNumber: string;
  email: string;
  name: string;
  accountType: string;
  active: boolean;
  ownerDetails?: string;
  bookings: string[];
  buses: string[];
  profileImage: string;
}

export default function UsersPage() {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/users`;

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  // Sorting and Filtering State
  const [statusFilter] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortOrder] = useState<"asc" | "desc">("asc");

  const usersPerPage = 5;

  // Fetch Users from API
  const fetchUsers = async () => {
    setLoading(true);
    setNoData(false);
    setUsers([]);
    try {
      const response = await fetch(
        `${API_URL}?page=${currentPage}&limit=${usersPerPage}&sort=${sortKey}&order=${sortOrder}&filter=Staff`,
        {
          method: "GET",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      console.log(data);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortKey, sortOrder, statusFilter]);

  // Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Sorting handler
  //   const toggleSortOrder = () => {
  //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  //   };

  // Filter handler
  // const handleFilterChange = (filter: string) => {
  //   setCurrentPage(1); // Reset to first page when filtering
  //   setStatusFilter(filter);
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-700">Users List</h1>
      </div>

      {/* Controls for Sorting and Filtering */}
      <div className="flex items-center justify-between mb-6 space-x-4">
        {/* Filter by Status */}

        {/* Sort by Key */}
        <Select value={sortKey} onValueChange={setSortKey}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort</SelectLabel>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="email">Sort by Email</SelectItem>
              <SelectItem value="phoneNumber">Sort by Phone Number</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Toggle Sort Order */}
        {/* <button
          onClick={toggleSortOrder}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
        >
          {sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
        </button> */}
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center text-black flex items-center justify-center h-96">
            Loading...
          </div>
        ) : noData ? (
          <div className="text-center text-black flex items-center justify-center h-96">
            No Users Found
          </div>
        ) : (
          <Table className="min-w-full shadow-md rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-medium">ID</TableHead>
                <TableHead className="text-sm font-medium">Name</TableHead>
                <TableHead className="text-sm font-medium">Email</TableHead>
                <TableHead className="text-sm font-medium">Phone</TableHead>
                <TableHead className="text-sm font-medium">
                  Account Type
                </TableHead>
                <TableHead className="text-sm font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-sm font-medium text-gray-900">
                    {user._id}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {user.phoneNumber}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {user.accountType}
                  </TableCell>
                  <TableCell
                    className={`text-sm font-semibold ${
                      user.active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </TableCell>
                  {/* <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => console.log(`Viewing user ${user._id}`)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                  </td> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination className="mt-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (number) => (
                <PaginationItem key={number}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(number)}
                    className={currentPage === number ? "active" : ""}
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
