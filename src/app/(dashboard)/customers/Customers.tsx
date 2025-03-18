import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";

import { customersData } from "@/data/mock";

const Customers = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateCustomer = () => {
    toast({
      title: "Customer created",
      description: "New customer has been added successfully.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewCustomer = (customer: any) => {
    router.push(`/customers/${customer.id}`);
  };

  const handleEditCustomer = (customer: any) => {
    toast({
      title: "Edit customer",
      description: `Editing customer: ${customer.name}`,
    });
  };

  const handleDeleteCustomer = (customer: any) => {
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
            <AvatarFallback>{value.split(" ").map(n => n[0]).join("")}</AvatarFallback>
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
      key: "phone",
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
        data={customersData}
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
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Full name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="Phone number"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Full address"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCustomer}>
              Add Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Customers;
