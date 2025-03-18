
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash, User, MapPin, Calendar, Clock, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import StatusBadge from "@/components/shared/StatusBadge";
import { bookingsData } from "@/data/mock";
import { useState } from "react";

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Find the booking by ID
  const booking = bookingsData.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Booking Not Found</h2>
        <p className="mt-2 text-muted-foreground">The booking you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => navigate("/bookings")}>
          Back to Bookings
        </Button>
      </div>
    );
  }

  const handleUpdateStatus = (status: string) => {
    toast({
      title: "Status updated",
      description: `Booking ${booking.id} has been marked as ${status}.`,
    });
  };

  const handleEdit = () => {
    toast({
      title: "Edit booking",
      description: `Editing booking: ${booking.id}`,
    });
  };

  const handleDelete = () => {
    toast({
      title: "Booking deleted",
      description: `Booking ${booking.id} has been deleted.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
    navigate("/bookings");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/bookings")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Booking: {booking.id}</h1>
          <StatusBadge status={booking.status} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    Date & Time
                  </div>
                  <p className="font-medium">
                    {booking.date} at {booking.time}
                  </p>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="mr-1 h-4 w-4" />
                    Amount
                  </div>
                  <p className="font-medium">{booking.amount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="mr-1 h-4 w-4" />
                Customer
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt={booking.customer} />
                  <AvatarFallback>{booking.customer.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{booking.customer}</p>
                  <p className="text-sm text-muted-foreground">ID: CUST-{Math.floor(Math.random() * 1000) + 1000}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                Address
              </div>
              <p className="mt-2 font-medium">{booking.address}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center text-sm text-muted-foreground">
                Service Type
              </div>
              <p className="mt-2 font-medium">{booking.service}</p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="mr-1 h-4 w-4" />
                Assigned Captain
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt={booking.captain} />
                  <AvatarFallback>{booking.captain.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{booking.captain}</p>
                  <p className="text-sm text-muted-foreground">Experienced Cleaner</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                Booking Timeline
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="h-full w-px bg-border"></div>
                  </div>
                  <div>
                    <p className="font-medium">Booking Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {booking.status === "completed" || booking.status === "ongoing" ? (
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div className="h-full w-px bg-border"></div>
                    </div>
                    <div>
                      <p className="font-medium">Service Started</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                  </div>
                ) : null}

                {booking.status === "completed" ? (
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Service Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.date} at {
                          (() => {
                            const [hours, minutes] = booking.time.split(':');
                            const period = booking.time.includes('PM') ? 'PM' : 'AM';
                            return `${parseInt(hours) + 2}:${minutes} ${period}`;
                          })()
                        }
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {booking.status === "scheduled" && (
              <Button onClick={() => handleUpdateStatus("ongoing")}>
                Mark as Ongoing
              </Button>
            )}
            {booking.status === "ongoing" && (
              <Button onClick={() => handleUpdateStatus("completed")}>
                Mark as Completed
              </Button>
            )}
            {booking.status !== "cancelled" && (
              <Button variant="outline" onClick={() => handleUpdateStatus("cancelled")}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Booking
              </Button>
            )}
            <Button variant="outline">
              Send Reminder
            </Button>
            <Button variant="outline">
              Print Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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

export default BookingDetail;
