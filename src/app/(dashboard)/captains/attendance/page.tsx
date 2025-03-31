"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, UserCheck, UserX, Calendar, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PageHeader from "@/components/shared/PageHeader";
import CardGrid from "@/components/shared/CardGrid";
import AttendanceForm from "@/components/forms/AttendanceForm";

import { captainsData } from "@/data/mock";

// Mock attendance data
const mockAttendanceData = [
  {
    id: 1,
    captain: "John Smith",
    type: "check-in",
    date: "2023-06-22",
    time: "09:00",
    vehicleReading: "12345",
    materials: "Cleaning supplies, vacuum cleaner, mop",
    notes: "All equipment in good condition",
  },
  {
    id: 2,
    captain: "Sara Johnson",
    type: "check-in",
    date: "2023-06-22",
    time: "08:45",
    vehicleReading: "7890",
    materials: "Cleaning solution, gloves, trash bags",
    notes: "Vehicle needs maintenance soon",
  },
  {
    id: 3,
    captain: "Michael Brown",
    type: "check-out",
    date: "2023-06-22",
    time: "17:30",
    vehicleReading: "7950",
    materials: "Returned all equipment",
    notes: "Completed all assigned tasks",
  },
  {
    id: 4,
    captain: "John Smith",
    type: "check-out",
    date: "2023-06-22",
    time: "18:15",
    vehicleReading: "12425",
    materials: "Missing one spray bottle",
    notes: "Traffic delay on route back",
  },
];

// Convert captains data to match the expected format with string IDs
const captainsForAttendance = captainsData.map((c) => ({
  id: String(c.id),
  username: c.name,
}));

const Attendance = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] =
    useState(mockAttendanceData);

  const handleCreateAttendance = (data: any) => {
    console.log("New attendance data:", data);

    // Create a new attendance record
    const newRecord = {
      id: attendanceRecords.length + 1,
      captain:
        captainsForAttendance.find((c) => c.id === data.captain)?.username ||
        "Unknown",
      type: data.attendanceType,
      date: data.date.toISOString().split("T")[0],
      time: data.time,
      vehicleReading:
        data.attendanceType === "check-in"
          ? data.vehicleReadingStart
          : data.vehicleReadingEnd,
      materials:
        data.attendanceType === "check-in"
          ? data.materialsTaken
          : data.materialsReturned,
      notes: data.notes,
    };

    setAttendanceRecords([newRecord, ...attendanceRecords]);

    toast({
      title: "Attendance recorded",
      description: `${newRecord.captain} ${data.attendanceType === "check-in" ? "checked in" : "checked out"} successfully.`,
    });

    setIsDialogOpen(false);
  };

  const getCaptainAvatar = (name: string) => {
    const captain = captainsData.find((c) => c.name === name);
    return captain?.avatar || "/placeholder.svg";
  };

  const getTypeIcon = (type: string) => {
    return type === "check-in" ? (
      <UserCheck className="h-6 w-6 text-green-500" />
    ) : (
      <UserX className="h-6 w-6 text-blue-500" />
    );
  };

  const checkedInCaptains = attendanceRecords
    .filter((record) => record.type === "check-in")
    .filter(
      (record) =>
        !attendanceRecords.some(
          (r) =>
            r.type === "check-out" &&
            r.captain === record.captain &&
            r.date === record.date &&
            r.time > record.time,
        ),
    )
    .map((record) => record.captain);

  return (
    <>
      <PageHeader
        title="Captain Attendance"
        description="Track captain check-ins and check-outs."
        action={{
          label: "Record Attendance",
          icon: <PlusCircle size={16} />,
          onClick: () => setIsDialogOpen(true),
        }}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Currently Checked In</CardTitle>
            <CardDescription>Captains on duty</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedInCaptains.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Records</CardTitle>
            <CardDescription>Total attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRecords.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>All Records</span>
          </TabsTrigger>
          <TabsTrigger value="check-in" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span>Check Ins</span>
          </TabsTrigger>
          <TabsTrigger value="check-out" className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            <span>Check Outs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <CardGrid columns={1}>
            {attendanceRecords.map((record) => (
              <Card key={record.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-full text-secondary-foreground">
                        {getTypeIcon(record.type)}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <Avatar className="h-5 w-5 mr-2">
                              <AvatarImage
                                src={getCaptainAvatar(record.captain)}
                                alt={record.captain}
                              />
                              <AvatarFallback>
                                {record.captain
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold">{record.captain}</h3>
                          </div>
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {record.type === "check-in"
                              ? "Check In"
                              : "Check Out"}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <span className="inline-flex items-center">
                            <Calendar className="mr-1 h-3 w-3" /> {record.date}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="inline-flex items-center">
                            <Clock className="mr-1 h-3 w-3" /> {record.time}
                          </span>
                        </div>
                        <div className="mt-2 grid gap-1">
                          {record.vehicleReading && (
                            <p className="text-sm">
                              <span className="font-medium">
                                Vehicle Reading:
                              </span>{" "}
                              {record.vehicleReading}
                            </p>
                          )}
                          {record.materials && (
                            <p className="text-sm">
                              <span className="font-medium">Materials:</span>{" "}
                              {record.materials}
                            </p>
                          )}
                          {record.notes && (
                            <p className="text-sm">
                              <span className="font-medium">Notes:</span>{" "}
                              {record.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardGrid>
        </TabsContent>

        <TabsContent value="check-in" className="mt-6">
          <CardGrid columns={1}>
            {attendanceRecords
              .filter((record) => record.type === "check-in")
              .map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-full text-secondary-foreground">
                          {getTypeIcon(record.type)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              <Avatar className="h-5 w-5 mr-2">
                                <AvatarImage
                                  src={getCaptainAvatar(record.captain)}
                                  alt={record.captain}
                                />
                                <AvatarFallback>
                                  {record.captain
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="font-semibold">
                                {record.captain}
                              </h3>
                            </div>
                            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                              Check In
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            <span className="inline-flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />{" "}
                              {record.date}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="inline-flex items-center">
                              <Clock className="mr-1 h-3 w-3" /> {record.time}
                            </span>
                          </div>
                          <div className="mt-2 grid gap-1">
                            {record.vehicleReading && (
                              <p className="text-sm">
                                <span className="font-medium">
                                  Vehicle Reading:
                                </span>{" "}
                                {record.vehicleReading}
                              </p>
                            )}
                            {record.materials && (
                              <p className="text-sm">
                                <span className="font-medium">
                                  Materials Taken:
                                </span>{" "}
                                {record.materials}
                              </p>
                            )}
                            {record.notes && (
                              <p className="text-sm">
                                <span className="font-medium">Notes:</span>{" "}
                                {record.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </CardGrid>
        </TabsContent>

        <TabsContent value="check-out" className="mt-6">
          <CardGrid columns={1}>
            {attendanceRecords
              .filter((record) => record.type === "check-out")
              .map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-full text-secondary-foreground">
                          {getTypeIcon(record.type)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              <Avatar className="h-5 w-5 mr-2">
                                <AvatarImage
                                  src={getCaptainAvatar(record.captain)}
                                  alt={record.captain}
                                />
                                <AvatarFallback>
                                  {record.captain
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="font-semibold">
                                {record.captain}
                              </h3>
                            </div>
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                              Check Out
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            <span className="inline-flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />{" "}
                              {record.date}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="inline-flex items-center">
                              <Clock className="mr-1 h-3 w-3" /> {record.time}
                            </span>
                          </div>
                          <div className="mt-2 grid gap-1">
                            {record.vehicleReading && (
                              <p className="text-sm">
                                <span className="font-medium">
                                  Vehicle Reading:
                                </span>{" "}
                                {record.vehicleReading}
                              </p>
                            )}
                            {record.materials && (
                              <p className="text-sm">
                                <span className="font-medium">
                                  Materials Returned:
                                </span>{" "}
                                {record.materials}
                              </p>
                            )}
                            {record.notes && (
                              <p className="text-sm">
                                <span className="font-medium">Notes:</span>{" "}
                                {record.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </CardGrid>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Record Attendance</DialogTitle>
            <DialogDescription>
              Record captain check-in or check-out details
            </DialogDescription>
          </DialogHeader>
          <AttendanceForm
            captains={captainsForAttendance}
            onSubmit={handleCreateAttendance}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Attendance;
