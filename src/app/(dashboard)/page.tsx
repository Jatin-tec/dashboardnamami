import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import {
  BarChart as BarChartIcon,
  Users,
  Calendar,
  DollarSign,
  PlusCircle,
  ArrowUpRight,
  Car,
  SprayCan,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import CardGrid from "@/components/shared/CardGrid";

import {
  statsData,
  bookingsData,
  todaysJobs,
  weeklyBookingsData,
  serviceDistributionData,
  revenueData,
} from "@/data/mock";
import Link from "next/link";

const Dashboard = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateBooking = () => {
    toast({
      title: "Not implemented",
      description: "This functionality is not implemented in the demo.",
    });
    setIsDialogOpen(false);
  };

  // Pie chart colors
  const COLORS = ["#0b4251", "#f2c864", "#36b9cc", "#e74a3b"];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your cleaning service operations."
        action={{
          label: "Create Booking",
          icon: <PlusCircle size={16} />,
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <CardGrid columns={4}>
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={<stat.icon />}
            change={stat.change}
            description={stat.description}
          />
        ))}
      </CardGrid>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Home cleaning vs car wash services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="home" name="Home Cleaning" fill="#0b4251" />
                <Bar dataKey="car" name="Car Wash" fill="#f2c864" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>Breakdown by service category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={serviceDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => entry.name}
                  labelLine={false}
                >
                  {serviceDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="bookings">
          <TabsList>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="jobs">Today's Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  The latest bookings across all services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingsData.slice(0, 4).map((booking, index) => (
                    <div
                      key={booking.id}
                      className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                    >
                      <div className="grid gap-1">
                        <div className="font-semibold">
                          {booking.service}
                          <StatusBadge
                            status={booking.status}
                            className="ml-2 inline-flex"
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.customer} • {booking.date} at {booking.time}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 sm:mt-0">
                        <div className="font-medium">{booking.amount}</div>
                        <Link href={`/bookings/${booking.id}`}>
                          <Button size="sm" variant="outline">
                            <span className="sr-only">View details</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/bookings">View all bookings</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Today's Jobs</CardTitle>
                <CardDescription>Scheduled cleanings for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysJobs.slice(0, 4).map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                    >
                      <div className="grid gap-1">
                        <div className="flex items-center">
                          <span className="font-semibold">{job.time}</span>
                          <StatusBadge
                            status={job.status}
                            className="ml-2 inline-flex"
                          />
                        </div>
                        <div className="text-sm">
                          {job.service} • {job.customer}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {job.address}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 sm:mt-0">
                        <div className="font-medium">
                          {job.captain} • {job.duration}
                        </div>
                        <Link href={`/jobs`}>
                          <Button size="sm" variant="outline">
                            <span className="sr-only">View details</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/jobs">View all jobs</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription>
              This functionality would allow you to create a new booking in the
              system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBooking}>Create Booking</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
