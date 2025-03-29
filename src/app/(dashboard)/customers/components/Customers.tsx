"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import CustomerForm from "@/components/forms/CustomerForm";

import { customersData } from "@/data/mock"; // Assuming this is available
import { Customer } from "@/types/types";

// Mock data for cities and subscription types (from old code)
const citiesData = [
  { id: 1, name: "New York" },
  { id: 2, name: "Los Angeles" },
  { id: 3, name: "Chicago" },
  { id: 4, name: "Houston" },
  { id: 5, name: "Phoenix" },
];

const subscriptionTypesData = [
  { id: 1, name: "Weekly", service: { name: "Home Cleaning" } },
  { id: 2, name: "Bi-weekly", service: { name: "Home Cleaning" } },
  { id: 3, name: "Monthly", service: { name: "Home Cleaning" } },
  { id: 4, name: "Premium", service: { name: "Car Wash" } },
  { id: 5, name: "Basic", service: { name: "Car Wash" } },
];

const Customers = ({ customers }: { customers: Customer[] | null }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateCustomer = (data: any) => {
    console.log("New customer data:", data);
    toast({
      title: "Customer created",
      description: "New customer has been added successfully.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewCustomer = (customer: Customer) => {
    router.push(`/customers/${customer.id}`);
  };

  const handleEditCustomer = (customer: Customer) => {
    toast({
      title: "Edit customer",
      description: `Editing customer: ${customer.name}`,
    });
  };

  const handleDeleteCustomer = (customer: Customer) => {
    toast({
      title: "Customer deleted",
      description: `Customer ${customer.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const columns = [
    {
      key: "name",
      label: "Customer Name",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar} alt={value} />
            <AvatarFallback>
              {value
                ?.split(" ")
                .map((n: string) => n[0])
                .join("") || "N/A"}
            </AvatarFallback>
          </Avatar>
          <div>{value}</div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone_number", // Adjusted to match new code's key
      label: "Phone",
    },
    {
      key: "totalBookings",
      label: "Total Bookings",
    },
    {
      key: "totalSpent",
      label: "Total Spent",
    },
    {
      key: "lastBooking",
      label: "Last Booking",
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
        title="Customers"
        description="Manage your customer database."
        action={{
          label: "Add Customer",
          icon: <PlusCircle size={16} />,
          onClick: () => setIsCreateDialogOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={customers || customersData} // Fallback to mock data if no prop provided
        onRowClick={handleViewCustomer}
        onView={handleViewCustomer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        filterOptions={{
          key: "status",
          options: ["all", "active", "inactive"],
        }}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your database.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            cities={citiesData}
            subscriptionTypes={subscriptionTypesData}
            onSubmit={handleCreateCustomer}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Customers;
