'use client'
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import StatusBadge from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";

import { bookingsData } from "@/data/mock";
import { Customer } from '@/types/types';

import { cn } from "@/lib/utils";


const CustomerDetail = ({ customer }: { customer: Customer | null }) => {
  const router = useRouter();
  const { toast } = useToast();

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Customer Not Found</h2>
        <p className="mt-2 text-muted-foreground">The customer you&apos;re looking for doesn&apos;t exist.</p>
        <Button className="mt-4" onClick={() => router.push("/customers")}>
          Back to Customers
        </Button>
      </div>
    );
  }

  const handleEdit = () => {
    toast({
      title: "Edit customer",
      description: `Editing customer: ${customer.name}`,
    });
  };

  // Filter bookings for this customer
  const customerBookings = bookingsData.filter(booking => booking.customer === customer.name);

  // Generate sample spending data
  const spendingData = [
    { month: "Jan", amount: Math.floor(Math.random() * 300) + 100 },
    { month: "Feb", amount: Math.floor(Math.random() * 300) + 100 },
    { month: "Mar", amount: Math.floor(Math.random() * 300) + 100 },
    { month: "Apr", amount: Math.floor(Math.random() * 300) + 100 },
    { month: "May", amount: Math.floor(Math.random() * 300) + 100 },
    { month: "Jun", amount: Math.floor(Math.random() * 300) + 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Customer Profile</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback>{customer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{customer.name}</h2>
              <div className="mt-2 flex items-center">
                <Badge variant="outline" className={cn(
                  "capitalize font-medium",
                  customer.is_active ? 'bg-green-100 text-green-800 hover:bg-green-100/80' : 'bg-red-100 text-red-800 hover:bg-red-100/80'
                )}
                >
                  {customer.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{customer.phone_number}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{customer.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Last booking: {customer.lastBooking}</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Bookings</p>
                  <p className="text-2xl font-bold">{customer.totalBookings}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="text-2xl font-bold">{customer.totalSpent}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Spending Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#0b4251"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Tabs defaultValue="history" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Booking History</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {customerBookings.length > 0 ? (
                      customerBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                          onClick={() => router.push(`/bookings/${booking.id}`)}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{booking.service}</span>
                              <StatusBadge status={booking.status} />
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {booking.date} at {booking.time} • {booking.amount}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <span className="text-sm">View</span>
                            <ArrowLeft className="h-3 w-3 rotate-180" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-muted-foreground">No bookings found for this customer.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Preferred Services</h3>
                      <div className="mt-2 space-y-2">
                        {customerBookings.length > 0 ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span>{customerBookings[0].service}</span>
                              <span className="text-sm text-muted-foreground">
                                {Math.floor(Math.random() * 5) + 1} times
                              </span>
                            </div>
                            {customerBookings.length > 1 && (
                              <div className="flex items-center justify-between">
                                <span>{customerBookings[1].service}</span>
                                <span className="text-sm text-muted-foreground">
                                  {Math.floor(Math.random() * 3) + 1} times
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">No preferences recorded yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Preferred Time Slots</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Morning (9 AM - 12 PM)</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 70) + 30}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Afternoon (12 PM - 5 PM)</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 50) + 10}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Communication Preferences</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Email notifications</span>
                          <StatusBadge status="active" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>SMS reminders</span>
                          <StatusBadge status="active" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Marketing communications</span>
                          <StatusBadge status={Math.random() > 0.5 ? "active" : "inactive"} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
