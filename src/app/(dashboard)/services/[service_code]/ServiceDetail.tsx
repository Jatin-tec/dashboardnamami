"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarDays,
  Clock,
  DollarSign,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/shared/DataTable";
import ServiceForm from "@/components/forms/ServiceForm";
import SubscriptionTypeForm from "@/components/forms/SubscriptionTypeForm";

// Mock service details
const serviceData = {
  id: 1,
  name: "Deep Home Cleaning",
  category: "Home Cleaning",
  price: "$120",
  duration: "3-4 hours",
  description:
    "Comprehensive deep cleaning service for your entire home, including hard-to-reach areas, appliances, and detailed attention to all surfaces.",
  status: "active",
};

// Mock subscription plans
const subscriptionPlans = [
  {
    id: 1,
    name: "Weekly",
    frequency: 7,
    price: 100,
    is_active: true,
    created_at: "2023-10-01",
  },
  {
    id: 2,
    name: "Bi-weekly",
    frequency: 14,
    price: 180,
    is_active: true,
    created_at: "2023-10-01",
  },
  {
    id: 3,
    name: "Monthly",
    frequency: 30,
    price: 320,
    is_active: true,
    created_at: "2023-10-01",
  },
];

// Mock bookings data
const bookingsData = [
  {
    id: "B001",
    customer: "John Doe",
    date: "2023-11-15",
    time: "10:00 AM",
    amount: "$120",
    status: "completed",
  },
  {
    id: "B002",
    customer: "Jane Smith",
    date: "2023-11-16",
    time: "2:00 PM",
    amount: "$120",
    status: "scheduled",
  },
  {
    id: "B003",
    customer: "Michael Johnson",
    date: "2023-11-17",
    time: "9:00 AM",
    amount: "$120",
    status: "canceled",
  },
];

const ServiceDetail = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);

  const handleEditService = () => {
    setIsEditServiceOpen(true);
  };

  const handleSaveService = (data: any) => {
    toast({
      title: "Service updated",
      description: "Service details have been updated successfully",
    });
    setIsEditServiceOpen(false);
  };

  const handleAddSubscription = () => {
    setIsAddSubscriptionOpen(true);
  };

  const handleSaveSubscription = (data: any) => {
    toast({
      title: "Subscription plan added",
      description: "Subscription plan has been added successfully",
    });
    setIsAddSubscriptionOpen(false);
  };

  const handleDeleteSubscription = (plan: any) => {
    toast({
      title: "Subscription plan deleted",
      description: `Subscription plan "${plan.name}" has been deleted`,
      variant: "destructive",
    });
  };

  const handleViewBooking = (booking: any) => {
    router.push(`/bookings/${booking.id}`);
  };

  // Subscription plans table columns
  const subscriptionColumns = [
    {
      key: "name",
      label: "Plan Name",
    },
    {
      key: "frequency",
      label: "Frequency (days)",
    },
    {
      key: "price",
      label: "Price",
      render: (value: number) => `$${value}`,
    },
    {
      key: "is_active",
      label: "Status",
      render: (value: boolean) =>
        value ? (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Active
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Inactive
          </Badge>
        ),
    },
    {
      key: "created_at",
      label: "Created",
    },
  ];

  // Bookings table columns
  const bookingColumns = [
    {
      key: "id",
      label: "Booking ID",
    },
    {
      key: "customer",
      label: "Customer",
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
      key: "amount",
      label: "Amount",
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        if (value === "completed") {
          return (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Completed
            </Badge>
          );
        } else if (value === "scheduled") {
          return (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Scheduled
            </Badge>
          );
        } else if (value === "canceled") {
          return (
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200"
            >
              Canceled
            </Badge>
          );
        }
        return <Badge variant="outline">{value}</Badge>;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title={serviceData.name}
        description={`Details for ${serviceData.name} service`}
        backButton={{
          label: "Back to Services",
          href: "/services",
        }}
        action={{
          label: "Edit Service",
          icon: <Edit size={16} />,
          onClick: handleEditService,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{serviceData.category}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-semibold">{serviceData.price}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{serviceData.duration}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="description" className="mb-6">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscription Plans</TabsTrigger>
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="p-4 border rounded-md mt-2">
          <p>{serviceData.description}</p>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-2">
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddSubscription}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subscription Plan
            </Button>
          </div>

          <DataTable
            columns={subscriptionColumns}
            data={subscriptionPlans}
            onDelete={handleDeleteSubscription}
          />
        </TabsContent>

        <TabsContent value="bookings" className="mt-2">
          <DataTable
            columns={bookingColumns}
            data={bookingsData}
            onRowClick={handleViewBooking}
            onView={handleViewBooking}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Service Dialog */}
      <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <ServiceForm
            initialData={{
              name: serviceData.name,
              description: serviceData.description,
              is_active: serviceData.status === "active",
              service_code: "SERV1",
            }}
            onSubmit={handleSaveService}
            onCancel={() => setIsEditServiceOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add Subscription Plan Dialog */}
      <Dialog
        open={isAddSubscriptionOpen}
        onOpenChange={setIsAddSubscriptionOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Subscription Plan</DialogTitle>
          </DialogHeader>
          <SubscriptionTypeForm
            services={[{ service_code: "SERV1", name: serviceData.name }]}
            onSubmit={handleSaveSubscription}
            onCancel={() => setIsAddSubscriptionOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceDetail;
