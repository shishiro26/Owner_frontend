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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface Bus {
  ownerName: string;
  sourceCity: string;
  destinationCity: string;
  restStopsCities: string[];
  _id: string;
  busId: string;
  ownerId: string;
  staff: string[];
  busCapacity: number;
  seats: string[];
  source: string;
  destination: string;
  busPhotos: string[];
  bus3DModels: string[];
  earningPerDay: number;
  restStops: string[];
  busNumber: string;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/bus`;

export default function BusTable() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  // Sorting and Filtering State
  // 'all', 'zero', 'non-zero'
  const [sortKey, setSortKey] = useState<string>("busNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // const busesPerPage = 5;

  const fetchBuses = async () => {
    setLoading(true);
    setBuses([]);
    try {
      const response = await fetch(`${API_URL}/api/owner/list/ownerId`, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to fetch buses");

      const data = await response.json();
      const busesWithDetails = await Promise.all(
        data.buses.map(
          async (bus: {
            ownerId: string;
            source: string;
            destination: string;
            restStops: string[];
          }) => {
            // Fetch owner name
            const ownerResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/users/${bus.ownerId}`,
              {
                method: "GET",
              }
            );
            const ownerData = await ownerResponse.json();
            const ownerName = ownerData.name || "Unknown Owner"; // Ensure fallback if owner name is not available

            // Fetch city names for source, destination, and rest stops
            const sourceResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/cities/city/${bus.source}`,
              {
                method: "GET",
              }
            );
            const sourceData = await sourceResponse.json();
            const sourceCity = sourceData.city.cityName || "Unknown City"; // Fallback if city name is not available

            const destinationResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/cities/city/${bus.destination}`,
              {
                method: "GET",
              }
            );
            const destinationData = await destinationResponse.json();
            console.log(destinationData.city.cityName);
            const destinationCity =
              destinationData.city.cityName || "Unknown City"; // Fallback if city name is not available

            const restStopsCities = await Promise.all(
              bus.restStops.map(async (restStopId: string) => {
                const restStopResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/cities/city/${restStopId}`,
                  {
                    method: "GET",
                  }
                );
                const restStopData = await restStopResponse.json();
                return restStopData.city.cityName || "Unknown City";
              })
            );

            // Return updated bus object with all details
            return {
              ...bus,
              ownerName: ownerName,
              sourceCity: sourceCity,
              destinationCity: destinationCity,
              restStopsCities: restStopsCities,
            };
          }
        )
      );
      console.log(busesWithDetails);
      setBuses(busesWithDetails);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [currentPage, sortKey, sortOrder]);

  // Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Sorting handler
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Filter handler

  return (
    <div>
      {/* Controls for Sorting and Filtering */}
      <div className="flex items-center justify-between mb-6 space-x-4">
        {/* Filter by Seats */}
        {/* <select
          value={filterBySeats}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm"
        >
          <option value="all">All Buses</option>
          <option value="">Buses with 0 Seats</option>
          <option value="non-zero">Buses with Non-Zero Seats</option>
        </select> */}

        {/* Sort by Key */}
        <Select value={sortKey} onValueChange={setSortKey}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort</SelectLabel>
              <SelectItem value="busNumber">Sort by Bus Number</SelectItem>
              <SelectItem value="busId">Sort by BusId</SelectItem>
              <SelectItem value="busCapacity">Sort by Bus Capacity</SelectItem>
              <SelectItem value="earningPerDay">
                Sort by Earning Per Day
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Toggle Sort Order */}
        <Button
          onClick={toggleSortOrder}
          className="px-4 py-2  text-white rounded-md  transition-colors text-sm"
          size={"sm"}
        >
          {sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
        </Button>
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center text-black flex items-center justify-center h-96">
            Loading...
          </div>
        ) : noData ? (
          <div className="text-center text-black flex items-center justify-center h-96">
            No Buses Found
          </div>
        ) : (
          <Table className="min-w-full bg-white shadow-md rounded-lg">
            <TableHeader className="bg-gray-200 text-gray-700">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-sm font-medium">
                  ID
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-sm font-medium">
                  Bus Number
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-sm font-medium">
                  Capacity
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-sm font-medium">
                  Earning Per Day
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-sm font-medium">
                  Owner
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-sm font-medium">
                  Source
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-sm font-medium">
                  Destination
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-sm font-medium">
                  Rest Stops
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-sm font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {buses.map((bus) => (
                <TableRow
                  key={bus._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">
                    {bus.busId}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-700">
                    {bus.busNumber}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-700">
                    {bus.busCapacity}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-700">
                    ₹{bus.earningPerDay}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-700">
                    {bus.ownerName}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-700">
                    {bus.sourceCity}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-700">
                    {bus.destinationCity}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-700">
                    {bus.restStopsCities.join(", ")}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-700">
                    <Button
                      className=" text-white rounded-md  transition-colors text-sm"
                      variant={"link"}
                    >
                      <Link href={`/admin/buses/${bus.busId}/edit`}>
                        Edit Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

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
