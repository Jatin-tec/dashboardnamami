"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import CardGrid from "@/components/shared/CardGrid";

import { todaysJobs, captainsData } from "@/data/mock";

const Jobs = () => {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdateStatus = (job: any, status: string) => {
    toast({
      title: "Status updated",
      description: `Job ${job.id} has been marked as ${status}.`,
    });
  };

  const handleJobDetail = (job: any) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const getCaptainAvatar = (name: string) => {
    const captain = captainsData.find((c) => c.name === name);
    return captain?.avatar || "/placeholder.svg";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "ongoing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "scheduled":
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const sortedJobs = [...todaysJobs].sort((a, b) => {
    const timeA = a.time;
    const timeB = b.time;

    // Convert to 24hr format for comparison
    const getTimeValue = (timeStr: string) => {
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      return hours * 60 + minutes;
    };

    return getTimeValue(timeA) - getTimeValue(timeB);
  });

  return (
    <>
      <PageHeader
        title="Today's Jobs"
        description="Scheduled cleaning jobs for today."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Scheduled</CardTitle>
            <CardDescription>Upcoming jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todaysJobs.filter((job) => job.status === "scheduled").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ongoing</CardTitle>
            <CardDescription>Jobs in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todaysJobs.filter((job) => job.status === "ongoing").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
            <CardDescription>Finished jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todaysJobs.filter((job) => job.status === "completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <CardGrid columns={1}>
        {sortedJobs.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className="flex flex-col border-l-4 sm:flex-row"
                style={{
                  borderLeftColor:
                    job.status === "completed"
                      ? "rgb(34, 197, 94)"
                      : job.status === "ongoing"
                        ? "rgb(59, 130, 246)"
                        : "rgb(156, 163, 175)",
                }}
              >
                <div className="flex flex-1 flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-full text-secondary-foreground">
                      {getStatusIcon(job.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{job.time}</h3>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="text-sm font-medium">{job.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.customer} • {job.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={getCaptainAvatar(job.captain)}
                          alt={job.captain}
                        />
                        <AvatarFallback>
                          {job.captain
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{job.captain}</span>
                    </div>
                    <Badge variant="outline">{job.duration}</Badge>
                  </div>
                </div>

                <div className="flex border-t sm:border-l sm:border-t-0">
                  {/* Modernized action buttons with consistent styling */}
                  <div className="flex w-full flex-row justify-evenly sm:flex-col">
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-none hover:bg-secondary"
                      onClick={() => handleJobDetail(job)}
                    >
                      View Details
                    </Button>

                    {job.status === "scheduled" && (
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-none border-l sm:border-l-0 sm:border-t hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleUpdateStatus(job, "ongoing")}
                      >
                        Start Job
                      </Button>
                    )}

                    {job.status === "ongoing" && (
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-none border-l sm:border-l-0 sm:border-t hover:bg-green-50 hover:text-green-600"
                        onClick={() => handleUpdateStatus(job, "completed")}
                      >
                        Complete Job
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardGrid>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>
              {selectedJob && `${selectedJob.id} • ${selectedJob.time}`}
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium">Service</div>
                <div className="col-span-2">{selectedJob.service}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium">Customer</div>
                <div className="col-span-2">{selectedJob.customer}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium">Address</div>
                <div className="col-span-2">{selectedJob.address}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium">Captain</div>
                <div className="col-span-2 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={getCaptainAvatar(selectedJob.captain)}
                      alt={selectedJob.captain}
                    />
                    <AvatarFallback>
                      {selectedJob.captain
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedJob.captain}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium">Duration</div>
                <div className="col-span-2">{selectedJob.duration}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium">Status</div>
                <div className="col-span-2">
                  <StatusBadge status={selectedJob.status} />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            {selectedJob && selectedJob.status === "scheduled" && (
              <Button
                variant="default"
                onClick={() => {
                  handleUpdateStatus(selectedJob, "ongoing");
                  setIsDialogOpen(false);
                }}
              >
                Start Job
              </Button>
            )}
            {selectedJob && selectedJob.status === "ongoing" && (
              <Button
                variant="default"
                onClick={() => {
                  handleUpdateStatus(selectedJob, "completed");
                  setIsDialogOpen(false);
                }}
              >
                Complete Job
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Jobs;
