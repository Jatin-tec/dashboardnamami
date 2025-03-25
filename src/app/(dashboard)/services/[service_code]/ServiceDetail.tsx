import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import StatusBadge from "@/components/shared/StatusBadge";
import { servicesList, serviceAttributes } from "@/data/mock";
import DataTable from "@/components/shared/DataTable";
import ServiceForm from "../components/ServiceForm";
import SubscriptionTypeForm from "../components/SubscriptionTypeForm";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddSubscriptionTypeDialogOpen, setIsAddSubscriptionTypeDialogOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Find the service by ID
  const service = servicesList.find((s) => s.id.toString() === id);

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Service Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The service you're looking for doesn't exist.
        </p>
        <Button className="mt-4" onClick={() => navigate("/services")}>
          Back to Services
        </Button>
      </div>
    );
  }

  const handleEditService = (data: any) => {
    toast({
      title: "Service updated",
      description: `Service ${data.name} has been updated.`,
    });
    setIsEditDialogOpen(false);
  };

  const handleAddSubscriptionType = (data: any) => {
    toast({
      title: "Subscription type added",
      description: `Subscription type ${data.name} has been added.`,
    });
    setIsAddSubscriptionTypeDialogOpen(false);
  };

  const handleDelete = () => {
    toast({
      title: "Service deleted",
      description: `Service ${service.name} has been deleted.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
    navigate("/services");
  };

  // Generate random attributes for the service
  const randomAttributes = serviceAttributes
    .sort(() => 0.5 - Math.random())
    .slice(0, 3 + Math.floor(Math.random() * 3));

  // Mock subscription types data
  const subscriptionTypes = [
    {
      id: 1,
      name: "Basic Monthly",
      frequency: 30,
      price: 99.99,
      is_active: true,
    },
    {
      id: 2,
      name: "Premium Weekly",
      frequency: 7,
      price: 49.99,
      is_active: true,
    },
    { id: 3, name: "One-time", frequency: 0, price: 150, is_active: false },
  ];

  const subscriptionTypeColumns = [
    { key: "name", label: "Name" },
    { key: "frequency", label: "Frequency (Days)" },
    {
      key: "price",
      label: "Price",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "is_active",
      label: "Status",
      render: (value: boolean) =>
        value ? (
          <Badge className="bg-green-500">Active</Badge>
        ) : (
          <Badge variant="outline">Inactive</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/services")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{service.name}</h1>
          <StatusBadge status={service.status} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="details"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="subscription-types">
            Subscription Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                  <CardDescription>
                    Complete information about this service.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Service Code
                      </h3>
                      <p>{service.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Category
                      </h3>
                      <p>{service.category}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Price
                      </h3>
                      <p>{service.price}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Duration
                      </h3>
                      <p>{service.duration}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Status
                      </h3>
                      <StatusBadge status={service.status} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        City
                      </h3>
                      <p>{service.city || "All Cities"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                      Description
                    </h3>
                    <p>{service.description}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                      Service Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {randomAttributes.map((attribute, index) => (
                        <Badge key={index} variant="outline">
                          {attribute}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Alert>
                <AlertTitle>Booking Statistics</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last 7 days:
                      </span>
                      <span className="font-medium">
                        {Math.floor(Math.random() * 20) + 5}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last 30 days:
                      </span>
                      <span className="font-medium">
                        {Math.floor(Math.random() * 50) + 20}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        All time:
                      </span>
                      <span className="font-medium">
                        {Math.floor(Math.random() * 500) + 100}
                      </span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subscription-types">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Subscription Types</CardTitle>
                <CardDescription>
                  Manage subscription plans for this service
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddSubscriptionTypeDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Plan
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={subscriptionTypeColumns}
                data={subscriptionTypes}
                onEdit={(row) => {
                  toast({
                    title: "Edit subscription type",
                    description: `Editing subscription type: ${row.name}`,
                  });
                }}
                onDelete={(row) => {
                  toast({
                    title: "Subscription type deleted",
                    description: `Subscription type ${row.name} has been deleted.`,
                    variant: "destructive",
                  });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update service information.</DialogDescription>
          </DialogHeader>
          <ServiceForm
            initialData={{
              name: service.name,
              description: service.description,
              is_active: service.status === "active",
            }}
            cities={[
              { id: 1, name: "New York" },
              { id: 2, name: "Los Angeles" },
              { id: 3, name: "Chicago" },
            ]}
            onSubmit={handleEditService}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add Subscription Type Dialog */}
      <Dialog
        open={isAddSubscriptionTypeDialogOpen}
        onOpenChange={setIsAddSubscriptionTypeDialogOpen}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Subscription Type</DialogTitle>
            <DialogDescription>
              Create a new subscription plan for this service.
            </DialogDescription>
          </DialogHeader>
          <SubscriptionTypeForm
            initialData={{
              service: service.id.toString(),
            }}
            services={[
              { service_code: service.id.toString(), name: service.name },
            ]}
            onSubmit={handleAddSubscriptionType}
            onCancel={() => setIsAddSubscriptionTypeDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDetail;
