"use client";
import { useRouter } from "next/navigation";
import BusTable from "./components/BusTable"; // Import the BusTable component
import { Button } from "@/components/ui/button";

export default function BusListingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        {/* Left Section: Header and Add Bus Button */}
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-semibold text-gray-700 mb-4">
            Bus List
          </h1>
          <Button
            onClick={() => router.push("/admin/buses/create")}
            className=" rounded-md hover:bg-gray-800 transition-colors text-sm"
            size={"sm"}
          >
            Add a Bus
          </Button>
        </div>
      </div>

      {/* Bus Table Component */}
      <BusTable />
    </div>
  );
}
