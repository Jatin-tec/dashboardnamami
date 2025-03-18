
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Grid3X3, List, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import CardGrid from "@/components/shared/CardGrid";

import { servicesList, serviceCategories, statusOptions } from "@/data/mock";

const Services = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  const handleCreateService = () => {
    toast({
      title: "Service created",
      description: "New service has been created successfully.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewService = (service: any) => {
    router.push(`/services/${service.id}`);
  };

  const handleEditService = (service: any) => {
    toast({
      title: "Edit service",
      description: `Editing service: ${service.name}`,
    });
  };

  const handleDeleteService = (service: any) => {
    toast({
      title: "Service deleted",
      description: `Service ${service.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const columns = [
    {
      key: "name",
      label: "Service Name",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "price",
      label: "Price",
    },
    {
      key: "duration",
      label: "Duration",
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
        title="Services"
        description="Manage your cleaning service offerings."
        action={{
          label: "Add Service",
          icon: <PlusCircle size={16} />,
          onClick: () => setIsCreateDialogOpen(true),
        }}
      />

      <div className="mb-6">
        <Tabs defaultValue="all" onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Services</TabsTrigger>
              {serviceCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.name.toLowerCase()}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            {viewMode === "grid" ? (
              <CardGrid columns={3}>
                {servicesList.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">{service.name}</CardTitle>
                      <CardDescription>{service.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid gap-1">
                        <div className="text-sm">{service.description}</div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-semibold">{service.price}</span>
                          <span className="text-sm text-muted-foreground">{service.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0">
                      <StatusBadge status={service.status} />
                      <Button size="sm" onClick={() => handleViewService(service)}>View</Button>
                    </CardFooter>
                  </Card>
                ))}
              </CardGrid>
            ) : (
              <DataTable
                columns={columns}
                data={servicesList}
                onRowClick={handleViewService}
                onView={handleViewService}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                filterOptions={{
                  key: "status",
                  options: statusOptions.service,
                }}
              />
            )}
          </TabsContent>

          {serviceCategories.map((category) => (
            <TabsContent key={category.id} value={category.name.toLowerCase()} className="mt-4">
              {viewMode === "grid" ? (
                <CardGrid columns={3}>
                  {servicesList
                    .filter((service) => service.category === category.name)
                    .map((service) => (
                      <Card key={service.id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{service.name}</CardTitle>
                          <CardDescription>{service.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="grid gap-1">
                            <div className="text-sm">{service.description}</div>
                            <div className="flex items-center justify-between pt-2">
                              <span className="font-semibold">{service.price}</span>
                              <span className="text-sm text-muted-foreground">{service.duration}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between p-4 pt-0">
                          <StatusBadge status={service.status} />
                          <Button size="sm" onClick={() => handleViewService(service)}>View</Button>
                        </CardFooter>
                      </Card>
                    ))}
                </CardGrid>
              ) : (
                <DataTable
                  columns={columns}
                  data={servicesList.filter((service) => service.category === category.name)}
                  onRowClick={handleViewService}
                  onView={handleViewService}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                  filterOptions={{
                    key: "status",
                    options: statusOptions.service,
                  }}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service offering for your customers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Service name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                placeholder="e.g. $75"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                placeholder="e.g. 2 hrs"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Service description"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateService}>
              Create Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Services;
