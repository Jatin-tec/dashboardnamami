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
  captainsData,
  servicesList,
  statusOptions,
  customersData,
} from "@/data/mock";
import { Booking } from "@/types/types";

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

const Bookings = ({ bookings }: { bookings: Booking[] | null }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignCaptainDialogOpen, setIsAssignCaptainDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const handleCreateBooking = (booking: Booking) => {
    console.log("New booking data:", booking);
    toast({
      title: "Booking created",
      description: "New booking has been created successfully.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewBooking = (booking: Booking) => {
    router.push(`/bookings/${booking.booking_id}`);
  };

  const handleEditBooking = (booking: Booking) => {
    toast({
      title: "Edit booking",
      description: `Editing booking: ${booking.booking_id}`,
    });
  };

  const handleDeleteBooking = (booking: Booking) => {
    toast({
      title: "Booking deleted",
      description: `Booking ${booking.booking_id} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleAssignCaptain = (booking: Booking) => {
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
      key: "booking_id",
      label: "Booking ID",
    },
    {
      key: "user",
      label: "Customer",
    },
    {
      key: "service",
      label: "Service",
    },
    {
      key: "subscription",
      label: "Subscription",
    },
    {
      key: "scheduled_date",
      label: "Date",
      render: (value: string) => (
        <div>
          {value}
        </div>
      ),
    },
    {
      key: "captain",
      label: "Captain",
      render: (value: string, row: Booking) => {
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
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge status={value} />,
    },
  ];

  if (!bookings) {
    return <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">No bookings available.</p>
    </div>;
  }

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
            data={bookings}
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
            data={bookings.filter(
              (booking) => booking.status === "scheduled",
            )}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
          />
        </TabsContent>

        <TabsContent value="ongoing" className="mt-6">
          <DataTable
            columns={columns}
            data={bookings.filter(
              (booking) => booking.status === "ongoing",
            )}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <DataTable
            columns={columns}
            data={bookings.filter(
              (booking) => booking.status === "completed",
            )}
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
            onSubmit={handleCaptainAssigned}
            onCancel={() => setIsAssignCaptainDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Bookings;
