'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";

import { Customer } from "@/types/types";
import { CustomerForm } from "./CustomerForm";

const Customers = ({ customers }: { customers: Customer[] | null }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);


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
            <AvatarFallback>{value?.split(" ").map(n => n[0]).join("")}</AvatarFallback>
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
      key: "phone_number",
      label: "Phone",
    },
    // {
    //   key: "totalBookings",
    //   label: "Total Bookings",
    // },
    // {
    //   key: "totalSpent",
    //   label: "Total Spent",
    // },
    // {
    //   key: "lastBooking",
    //   label: "Last Booking",
    // },
    // {
    //   key: "status",
    //   label: "Status",
    //   render: (value: string) => <StatusBadge status={value} />,
    // },
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
        data={customers || []}
        onRowClick={handleViewCustomer}
        onView={handleViewCustomer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
      // filterOptions={{
      //   key: "status",
      //   options: ["all", "active", "inactive"],
      // }}
      />

      <CustomerForm isCreateDialogOpen={isCreateDialogOpen} setIsCreateDialogOpen={setIsCreateDialogOpen} />
    </>
  );
};

export default Customers;
