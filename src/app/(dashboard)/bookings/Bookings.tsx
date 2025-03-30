"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Calendar, Clock, CheckCheck } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";

import { captainsData, servicesList, statusOptions } from "@/data/mock";
import { Booking, Service, SubscriptionType, User } from "@/types/types";

const Bookings = ({ bookings }: { bookings: Booking[] | null }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  console.log(bookings);

  const handleCreateBooking = () => {
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

  const columns = [
    {
      key: "booking_id",
      label: "Booking ID",
    },
    {
      key: "user",
      label: "Customer",
      render: (value: User) => (
        <div>{value.email}</div>
      ),
    },
    {
      key: "subscription_type",
      label: "Service",
      render: (value: SubscriptionType) => (
        <div>{value.service.name}</div>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (value: string) => (
        <div>{new Date(value).toDateString()}</div>
      ),
    },
    {
      key: "captain",
      label: "Captain",
      render: (value: User) => (
        <div>{value?.email || '-' }</div>
      ),
    },
    {
      key: "subscription_type",
      label: "Amount",
      render: (value: SubscriptionType) => (
        <div>{value.price}</div>
      ),
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
          {bookings && <DataTable
            columns={columns}
            data={bookings}
            onRowClick={handleViewBooking}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
            filterOptions={{
              key: "status",
              options: statusOptions.booking,
            }}
          />}
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          {bookings && <DataTable
            columns={columns}
            data={bookings.filter((booking) => booking.status === "scheduled")}
            onRowClick={handleViewBooking}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
          />}
        </TabsContent>

        <TabsContent value="ongoing" className="mt-6">
          {bookings && <DataTable
            columns={columns}
            data={bookings.filter((booking) => booking.status === "ongoing")}
            onRowClick={handleViewBooking}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
          />}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {bookings && <DataTable
            columns={columns}
            data={bookings.filter((booking) => booking.status === "completed")}
            onRowClick={handleViewBooking}
            onView={handleViewBooking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
          />}
        </TabsContent>
      </Tabs>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>
              Book a new cleaning service for a customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Customer
              </Label>
              <Input
                id="customer"
                placeholder="Customer name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {servicesList.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name} - {service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="captain" className="text-right">
                Captain
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select captain" />
                </SelectTrigger>
                <SelectContent>
                  {captainsData.map((captain) => (
                    <SelectItem key={captain.id} value={captain.name}>
                      {captain.name} - {captain.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBooking}>
              Create Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Bookings;
