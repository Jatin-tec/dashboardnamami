"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarDays,
  Clock,
  Check,
  Edit,
  Trash2,
  Plus,
  Tag,
  MapPin,
  Star,
  Image as ImageIcon,
  ShieldCheck,
  Award,
  Heart,
} from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DataTable from "@/components/shared/DataTable";
import ServiceForm from "@/components/forms/ServiceForm";
import PackageForm from "@/components/forms/PackageForm";
import { getServiceIcon } from "@/components/shared/CleaningServices";
import Image from "next/image";

// Mock service details
const serviceData = {
  service_code: "SERV1",
  name: "Car Cleaning",
  category: "Car",
  description:
    "Professional car cleaning service with attention to detail. We clean both interior and exterior of your vehicle.",
  is_active: true,
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
};

// Mock service packages
const packageData = [
  {
    id: 1,
    name: "One-time",
    credits: 1,
    validity_days: 7,
    price: 249,
    is_active: true,
  },
  {
    id: 2,
    name: "Monthly",
    credits: 4,
    validity_days: 30,
    price: 199,
    is_active: true,
  },
  {
    id: 3,
    name: "Yearly",
    credits: 24,
    validity_days: 365,
    price: 185,
    is_active: true,
  },
];

// Mock service categories
const categoryData = [
  {
    id: 1,
    name: "Small",
    description: "Standard cleaning for small cars",
  },
  {
    id: 2,
    name: "Big",
    description: "Deep cleaning for larger vehicles",
  },
];

// Mock service attributes
const attributeData = [
  { id: 1, name: "Exterior Wash", value: "Included", is_highlighted: true },
  { id: 2, name: "Interior Vacuum", value: "Included", is_highlighted: true },
  { id: 3, name: "Seats", value: "Included", is_highlighted: false },
  { id: 4, name: "Roof Top", value: "Included", is_highlighted: false },
  { id: 5, name: "Glass Cleaning", value: "Included", is_highlighted: false },
];

// Mock cities where service is available
const citiesData = [
  { id: "1", name: "Delhi", state: { id: 1, name: "Delhi" } },
  { id: "2", name: "Mumbai", state: { id: 2, name: "Maharashtra" } },
  { id: "3", name: "Bangalore", state: { id: 3, name: "Karnataka" } },
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
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [packageToEdit, setPackageToEdit] = useState<any>(null);

  const handleEditService = () => {
    setIsEditServiceOpen(true);
  };

  const handleSaveService = () => {
    toast({
      title: "Service updated",
      description: "Service details have been updated successfully",
    });
    setIsEditServiceOpen(false);
  };

  const handleAddPackage = () => {
    setPackageToEdit(null);
    setIsAddPackageOpen(true);
  };

  const handleEditPackage = (pkg: any) => {
    setPackageToEdit(pkg);
    setIsAddPackageOpen(true);
  };

  const handleSavePackage = (data: any) => {
    toast({
      title: packageToEdit ? "Package updated" : "Package added",
      description: `Service package has been ${packageToEdit ? "updated" : "added"} successfully`,
    });
    setIsAddPackageOpen(false);
    setPackageToEdit(null);
  };

  const handleDeletePackage = (plan: any) => {
    toast({
      title: "Package deleted",
      description: `Service package "${plan.name}" has been deleted`,
      variant: "destructive",
    });
  };

  const handleViewBooking = (booking: any) => {
    router.push(`/bookings/${booking.id}`);
  };

  // Package plans table columns
  const packageColumns = [
    {
      key: "name",
      label: "Package Name",
    },
    {
      key: "credits",
      label: "Credits",
    },
    {
      key: "validity_days",
      label: "Validity (Days)",
    },
    {
      key: "price",
      label: "Price",
      render: (value: number) => `₹${value}`,
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Main content area - 8 columns on large screens */}
        <div className="lg:col-span-8 space-y-6">
          {/* Image Gallery */}
          <Card className="overflow-hidden border-none shadow-md">
            <div className="relative aspect-[16/9] bg-muted">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10" />
              <Image
                src={serviceData.images[selectedImage]}
                alt={serviceData.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 left-4 z-20">
                <Badge className="bg-white/80 text-black backdrop-blur-sm">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  {selectedImage + 1}/{serviceData.images.length}
                </Badge>
              </div>
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-white/80 text-primary backdrop-blur-sm border-none"
                >
                  <Clock className="h-3 w-3 mr-1" /> 45-60 min
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/80 text-primary backdrop-blur-sm border-none"
                >
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />{" "}
                  4.0
                </Badge>
              </div>
            </div>
            <div className="p-4 flex gap-2 overflow-x-auto bg-muted/5">
              {serviceData.images.map((image, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden transition-all ${
                    selectedImage === index
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${serviceData.name} ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Description and How it Works */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="mr-2 bg-primary/10 p-2 rounded-full">
                  {getServiceIcon(serviceData.name)}
                </div>
                About This Service
              </CardTitle>
              <CardDescription>
                Detailed information about {serviceData.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="leading-7 text-muted-foreground">
                  {serviceData.description}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                  How It Works
                </h3>
                <ol className="space-y-3 ml-6 list-decimal">
                  <li className="pl-2">
                    <span className="font-medium">Purchase a package</span>
                    <p className="text-sm text-muted-foreground">
                      Choose between one-time, monthly or yearly plans
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Receive service credits</span>
                    <p className="text-sm text-muted-foreground">
                      Credits are immediately added to your account
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">
                      Book services with credits
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Schedule appointments at your preferred time and date
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Professional service</span>
                    <p className="text-sm text-muted-foreground">
                      Our captains arrive at your scheduled time
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Satisfaction guaranteed</span>
                    <p className="text-sm text-muted-foreground">
                      High quality service with attention to detail
                    </p>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          {/* <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Service Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Professional Equipment</h4>
                    <p className="text-sm text-muted-foreground">We use high-quality cleaning products</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Trained Professionals</h4>
                    <p className="text-sm text-muted-foreground">Experienced and skilled cleaning staff</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Convenient Scheduling</h4>
                    <p className="text-sm text-muted-foreground">Book cleanings at your preferred time</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Satisfaction Guaranteed</h4>
                    <p className="text-sm text-muted-foreground">100% satisfaction or we'll re-clean</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Sidebar - 4 columns on large screens */}
        <div className="lg:col-span-4 space-y-6">
          {/* Service Info Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Category
                </span>
                <span className="font-medium">{serviceData.category}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Rating
                </span>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star
                        key={num}
                        className={`h-4 w-4 ${num <= 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">(4.0)</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Duration
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>45-60 minutes</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Available In
                </h4>
                <div className="flex flex-wrap gap-2">
                  {citiesData.map((city) => (
                    <Badge
                      key={city.id}
                      variant="outline"
                      className="flex items-center gap-1 bg-muted/20"
                    >
                      <MapPin className="h-3 w-3" />
                      {city.name}, {city.state.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Features Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Service Includes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {attributeData.map((attr) => (
                  <li key={attr.id} className="flex items-center gap-2">
                    <div
                      className={`p-1 rounded-full ${attr.is_highlighted ? "bg-primary/20" : "bg-muted"}`}
                    >
                      <Check
                        className={`h-3 w-3 ${attr.is_highlighted ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <span
                      className={
                        attr.is_highlighted
                          ? "font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {attr.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {/* <Card className="shadow-sm bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="lg">
                <Tag className="mr-2 h-4 w-4" /> Book Now
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <CalendarDays className="mr-2 h-4 w-4" /> View Schedule
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </div>

      <Tabs defaultValue="packages" className="mb-6">
        <TabsList className="mb-2">
          <TabsTrigger value="packages">Service Packages</TabsTrigger>
          <TabsTrigger value="categories">Service Categories</TabsTrigger>
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Package Management</h3>
            <Button onClick={handleAddPackage}>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>

          <DataTable
            columns={packageColumns}
            data={packageData}
            onDelete={handleDeletePackage}
            onEdit={handleEditPackage}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Service Categories</h3>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryData.map((category) => (
              <Card key={category.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
              is_active: serviceData.is_active,
              service_code: serviceData.service_code,
            }}
            onSubmit={handleSaveService}
            onCancel={() => setIsEditServiceOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add/Edit Package Dialog */}
      <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {packageToEdit ? "Edit Package" : "Add Package"}
            </DialogTitle>
          </DialogHeader>
          <PackageForm
            initialData={packageToEdit || {}}
            cities={citiesData}
            serviceId={serviceData.service_code}
            onSubmit={handleSavePackage}
            onCancel={() => setIsAddPackageOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceDetail;
