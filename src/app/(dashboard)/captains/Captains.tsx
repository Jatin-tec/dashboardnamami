'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Grid3X3, List, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import CardGrid from "@/components/shared/CardGrid";

import { captainsData, serviceCategories, statusOptions } from "@/data/mock";

const Captains = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateCaptain = () => {
    toast({
      title: "Captain created",
      description: "New captain has been added successfully.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewCaptain = (captain: any) => {
    router.push(`/captains/${captain.id}`);
  };

  const handleEditCaptain = (captain: any) => {
    toast({
      title: "Edit captain",
      description: `Editing captain: ${captain.name}`,
    });
  };

  const handleDeleteCaptain = (captain: any) => {
    toast({
      title: "Captain deleted",
      description: `Captain ${captain.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const columns = [
    {
      key: "name",
      label: "Captain Name",
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
      key: "specialization",
      label: "Specialization",
    },
    {
      key: "rating",
      label: "Rating",
      render: (value: number) => (
        <div className="flex items-center">
          {value}
          <Star className="ml-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
        </div>
      ),
    },
    {
      key: "jobsCompleted",
      label: "Jobs Completed",
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
        title="Captains"
        description="Manage your cleaning service professionals."
        action={{
          label: "Add Captain",
          icon: <PlusCircle size={16} />,
          onClick: () => setIsCreateDialogOpen(true),
        }}
      />

      <div className="mb-4 flex items-center justify-end gap-2">
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

      {viewMode === "grid" ? (
        <CardGrid columns={3}>
          {captainsData.map((captain) => (
            <Card key={captain.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={captain.avatar} alt={captain.name} />
                      <AvatarFallback>{captain.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      <h3 className="text-base font-medium">{captain.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {captain.specialization}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={captain.status} />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center">
                      <span className="font-medium">{captain.rating}</span>
                      <Star className="ml-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jobs Completed</span>
                    <span className="font-medium">{captain.jobsCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Joined</span>
                    <span className="font-medium">{captain.joinedDate}</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <div>{captain.email}</div>
                  <div>{captain.phone}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                <Button size="sm" variant="outline" onClick={() => handleEditCaptain(captain)}>
                  Edit
                </Button>
                <Button size="sm" onClick={() => handleViewCaptain(captain)}>
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardGrid>
      ) : (
        <DataTable
          columns={columns}
          data={captainsData}
          onRowClick={handleViewCaptain}
          onView={handleViewCaptain}
          onEdit={handleEditCaptain}
          onDelete={handleDeleteCaptain}
          filterOptions={{
            key: "status",
            options: statusOptions.captain,
          }}
        />
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Captain</DialogTitle>
            <DialogDescription>
              Add a new cleaning professional to your team.
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
              <Label htmlFor="specialization" className="text-right">
                Specialization
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select specialization" />
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
            <Button onClick={handleCreateCaptain}>
              Add Captain
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Captains;
