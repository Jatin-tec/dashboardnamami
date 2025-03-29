
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

// Define form schema with Zod
const taskSchema = z.object({
  subscription: z.string().min(1, "Subscription is required"),
  captain: z.string().optional(),
  scheduled_date: z.date({
    required_error: "Scheduled date is required",
  }),
  status: z.enum(["Scheduled", "In Progress", "Completed", "Rescheduled"]).default("Scheduled"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Partial<TaskFormValues>;
  subscriptions?: { booking_id: string; user: { username: string } }[];
  captains?: { id: string; username: string }[];
  onSubmit: (data: TaskFormValues) => void;
  onCancel: () => void;
}

const TaskForm = ({
  initialData = {},
  subscriptions = [],
  captains = [],
  onSubmit,
  onCancel,
}: TaskFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      subscription: initialData.subscription || "",
      captain: initialData.captain || "",
      scheduled_date: initialData.scheduled_date ? new Date(initialData.scheduled_date) : new Date(),
      status: initialData.status || "Scheduled",
    },
  });

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      toast({
        title: "Success",
        description: "Task has been saved successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save task. Please try again.",
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
          name="subscription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subscription" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subscriptions.map((sub) => (
                    <SelectItem key={sub.booking_id} value={sub.booking_id}>
                      {sub.user.username} - {sub.booking_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The subscription this task is for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="captain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Captain</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign a captain" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {captains.map((captain) => (
                    <SelectItem key={captain.id} value={captain.id}>
                      {captain.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The captain assigned to this task
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduled_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Scheduled Date</FormLabel>
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
