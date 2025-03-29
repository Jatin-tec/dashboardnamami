"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Calendar, Clock, CheckCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import BookingForm from "@/components/forms/BookingForm";
import AssignCaptainForm from "@/components/forms/AssignCaptainForm";

import {
  bookingsData,
  captainsData,
  servicesList,
  statusOptions,
  customersData,
} from "@/data/mock";

// Sample subscription types for demo
const subscriptionTypesData = [
  {
    id: 1,
    name: "Weekly",
    service: { service_code: "SERV1", name: "Home Cleaning" },
  },
  {
    id: 2,
    name: "Bi-weekly",
    service: { service_code: "SERV1", name: "Home Cleaning" },
  },
  {
    id: 3,
    name: "Monthly",
    service: { service_code: "SERV1", name: "Home Cleaning" },
  },
  {
    id: 4,
    name: "Premium",
    service: { service_code: "SERV2", name: "Car Wash" },
  },
  {
    id: 5,
    name: "Basic",
    service: { service_code: "SERV2", name: "Car Wash" },
  },
];

// Convert customers data to match the expected format with string IDs
const customersForBooking = customersData.map((c) => ({
  id: String(c.id),
  username: c.name,
}));

// Convert captains data to match the expected format with string IDs
const captainsForBooking = captainsData.map((c) => ({
  id: String(c.id),
  username: c.name,
}));

// Convert services data to match the expected format
const servicesForBooking = servicesList.map((s) => ({
  service_code: s.id.toString(),
  name: s.name,
}));

const Bookings = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignCaptainDialogOpen, setIsAssignCaptainDialogOpen] =
    useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const handleCreateBooking = (data: any) => {
    console.log("New booking data:", data);
    toast({
      title: "Booking created",
      description: "New booking has been created successfully.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewBooking = (booking: any) => {
    router.push(`/bookings/${booking.id}`);
  };

  const handleEditBooking = (booking: any) => {
    toast({
      title: "Edit booking",
      description: `Editing booking: ${booking.id}`,
    });
  };

  const handleDeleteBooking = (booking: any) => {
    toast({
      title: "Booking deleted",
      description: `Booking ${booking.id} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleAssignCaptain = (booking: any) => {
    setSelectedBooking(booking);
    setIsAssignCaptainDialogOpen(true);
  };

  const handleCaptainAssigned = (data: { captain: string }) => {
    toast({
      title: "Captain assigned",
      description: `Captain has been assigned to booking ${selectedBooking?.id}`,
    });
    setIsAssignCaptainDialogOpen(false);
  };

  const columns = [
    {
      key: "id",
      label: "Booking ID",
    },
    {
      key: "customer",
      label: "Customer",
    },
    {
      key: "service",
      label: "Service",
    },
    {
      key: "date",
      label: "Date",
      render: (value: string, row: any) => (
        <div>
          {value} - {row.time}
        </div>
      ),
    },
    {
      key: "captain",
      label: "Captain",
      render: (value: string, row: any) => {
        if (!value || value === "Unassigned") {
          return (
            <button
              className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                handleAssignCaptain(row);
              }}
            >
              Assign Captain
            </button>
          );
        }
        return value;
      },
    },
    {
      key: "amount",
      label: "Amount",
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Manage all customer bookings."
        action={{
          label: "New Booking",
          icon: <PlusCircle size={16} />,
          onClick: () => setIsCreateDialogOpen(true),
        }}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>All Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Scheduled</span>
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Ongoing</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCheck className="h-4 w-4" />
            <span>Completed</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <DataTable
            columns={columns}
            data={bookingsData}
            onRowClick={handleViewBooking}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
            filterOptions={{
              key: "status",
              options: statusOptions.booking,
            }}
          />
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <DataTable
            columns={columns}
            data={bookingsData.filter(
              (booking) => booking.status === "scheduled",
            )}
            onRowClick={handleViewBooking}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
          />
        </TabsContent>

        <TabsContent value="ongoing" className="mt-6">
          <DataTable
            columns={columns}
            data={bookingsData.filter(
              (booking) => booking.status === "ongoing",
            )}
            onRowClick={handleViewBooking}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <DataTable
            columns={columns}
            data={bookingsData.filter(
              (booking) => booking.status === "completed",
            )}
            onRowClick={handleViewBooking}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
          />
        </TabsContent>
      </Tabs>

      {/* New Booking Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>
              Book a new cleaning service for a customer.
            </DialogDescription>
          </DialogHeader>
          <BookingForm
            customers={customersForBooking}
            services={servicesForBooking}
            captains={captainsForBooking}
            subscriptionTypes={subscriptionTypesData}
            onSubmit={handleCreateBooking}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Assign Captain Dialog */}
      <Dialog
        open={isAssignCaptainDialogOpen}
        onOpenChange={setIsAssignCaptainDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Captain</DialogTitle>
            <DialogDescription>
              Assign a captain to booking #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          <AssignCaptainForm
            bookingId={selectedBooking?.id || ""}
            captains={captainsForBooking}
            onSubmit={handleCaptainAssigned}
            onCancel={() => setIsAssignCaptainDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Bookings;
