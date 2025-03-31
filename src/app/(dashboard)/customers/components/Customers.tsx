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
import { Badge } from "@/components/ui/badge";
import CustomerForm from "@/components/forms/CustomerForm";

import { customersData } from "@/data/mock"; // Assuming this is available
import { Customer } from "@/types/types";
import { createCustomer } from "../server/actions/customer";

import { cn } from "@/lib/utils";

const Customers = ({ customers }: { customers: Customer[] | null }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateCustomer = async (data: any) => {
    console.log("New customer data:", data);
    const response = await createCustomer(data);
    console.log("Create customer response:", response);
    if (response.status === "error") {
      toast({
        title: "Error creating customer",
        description: response.message,
        variant: "destructive",
      });
      return;
    }
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
      key: "is_active",
      label: "Status",
      render: (value: string) => <Badge variant="outline" className={cn(
        "capitalize font-medium",
        value ? 'bg-green-100 text-green-800 hover:bg-green-100/80' : 'bg-red-100 text-red-800 hover:bg-red-100/80'
      )}
      >
        {value ? 'Active' : 'Inactive'}
      </Badge>
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
            onSubmit={handleCreateCustomer}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Customers;
