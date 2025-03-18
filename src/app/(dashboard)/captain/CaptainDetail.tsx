import { useRouter } from 'next/navigation';
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Star, Phone, Mail, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import StatusBadge from "@/components/shared/StatusBadge";
import { captainsData, bookingsData } from "@/data/mock";

const CaptainDetail = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  // Find the captain by ID
  const captain = captainsData.find((c) => c.id.toString() === id);

  if (!captain) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Captain Not Found</h2>
        <p className="mt-2 text-muted-foreground">The captain you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => router.push("/captains")}>
          Back to Captains
        </Button>
      </div>
    );
  }

  const handleEdit = () => {
    toast({
      title: "Edit captain",
      description: `Editing captain: ${captain.name}`,
    });
  };

  // Filter bookings for this captain
  const captainBookings = bookingsData.filter(booking => booking.captain === captain.name);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/captains")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Captain Profile</h1>
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
                <AvatarImage src={captain.avatar} alt={captain.name} />
                <AvatarFallback>{captain.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{captain.name}</h2>
              <p className="text-muted-foreground">{captain.specialization}</p>
              <div className="mt-2 flex items-center">
                <StatusBadge status={captain.status} />
              </div>
              <div className="mt-4 flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold">{captain.rating}</span>
                <span className="text-sm text-muted-foreground">/ 5</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{captain.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{captain.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{captain.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Joined on {captain.joinedDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Jobs Completed</span>
                    <span className="text-sm font-medium">{captain.jobsCompleted}</span>
                  </div>
                  <Progress value={Math.min(captain.jobsCompleted / 5, 100)} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Satisfaction</span>
                    <span className="text-sm font-medium">{(captain.rating / 5 * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={captain.rating / 5 * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">On-time Arrival</span>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Job Acceptance Rate</span>
                    <span className="text-sm font-medium">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="bookings" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
              <TabsTrigger value="skills">Skills & Certifications</TabsTrigger>
            </TabsList>
            <TabsContent value="bookings" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {captainBookings.length > 0 ? (
                      captainBookings.map((booking, index) => (
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
                              {booking.customer} • {booking.date} at {booking.time}
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
                        <p className="text-muted-foreground">No bookings found for this captain.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="skills" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <h3 className="font-medium">Professional Cleaning Certification</h3>
                        <p className="text-sm text-muted-foreground">Certified in advanced cleaning techniques</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <h3 className="font-medium">Car Detailing Expert</h3>
                        <p className="text-sm text-muted-foreground">Specialized in automotive cleaning</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <h3 className="font-medium">Eco-friendly Cleaning Products</h3>
                        <p className="text-sm text-muted-foreground">Trained in using environmentally safe cleaning solutions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <h3 className="font-medium">Time Management Pro</h3>
                        <p className="text-sm text-muted-foreground">Consistently completes jobs within allocated timeframes</p>
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

export default CaptainDetail;
