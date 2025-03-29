
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

// Define form schema with Zod
const attendanceSchema = z.object({
  captain: z.string({
    required_error: "Please select a captain",
  }),
  attendanceType: z.enum(["check-in", "check-out"], {
    required_error: "Please select an attendance type",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please enter a time",
  }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in 24-hour format (HH:MM)"),
  vehicleReadingStart: z.string().optional(),
  vehicleReadingEnd: z.string().optional(),
  materialsTaken: z.string().optional(),
  materialsReturned: z.string().optional(),
  notes: z.string().optional(),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

interface AttendanceFormProps {
  captains: { id: string; username: string }[];
  onSubmit: (data: AttendanceFormValues) => void;
  onCancel: () => void;
}

const AttendanceForm = ({
  captains,
  onSubmit,
  onCancel,
}: AttendanceFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      captain: "",
      attendanceType: "check-in",
      date: new Date(),
      time: format(new Date(), "HH:mm"),
      vehicleReadingStart: "",
      vehicleReadingEnd: "",
      materialsTaken: "",
      materialsReturned: "",
      notes: "",
    },
  });

  const attendanceType = form.watch("attendanceType");

  const handleSubmit = async (values: AttendanceFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      toast({
        title: "Success",
        description: `Attendance ${values.attendanceType === "check-in" ? "check-in" : "check-out"} recorded successfully`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="captain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Captain</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a captain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {captains.map((captain) => (
                    <SelectItem key={captain.id} value={captain.id}>
                      {captain.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attendanceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attendance Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="check-in">Check In</SelectItem>
                  <SelectItem value="check-out">Check Out</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input {...field} placeholder="HH:MM" />
                  </FormControl>
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <FormDescription>
                  Enter time in 24-hour format (e.g., 14:30)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {attendanceType === "check-in" ? (
          <FormField
            control={form.control}
            name="vehicleReadingStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Meter Reading (Start)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="Enter vehicle meter reading" />
                </FormControl>
                <FormDescription>
                  Enter the vehicle meter reading at the start of the day
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="vehicleReadingEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Meter Reading (End)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="Enter vehicle meter reading" />
                </FormControl>
                <FormDescription>
                  Enter the vehicle meter reading at the end of the day
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {attendanceType === "check-in" ? (
          <FormField
            control={form.control}
            name="materialsTaken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Materials Taken</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="List materials taken for the day's jobs"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="materialsReturned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Materials Returned</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="List materials returned after completion"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any additional notes or comments"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : `Record ${attendanceType === "check-in" ? "Check In" : "Check Out"}`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AttendanceForm;
