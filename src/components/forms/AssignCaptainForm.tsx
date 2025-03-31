
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define form schema with Zod
const assignCaptainSchema = z.object({
  captain: z.string().min(1, "Captain selection is required"),
});

type AssignCaptainFormValues = z.infer<typeof assignCaptainSchema>;

interface AssignCaptainFormProps {
  bookingId: string;
  captains: { id: string; username: string }[];
  onSubmit: (data: AssignCaptainFormValues) => void;
  onCancel: () => void;
}

const AssignCaptainForm = ({
  bookingId,
  captains,
  onSubmit,
  onCancel,
}: AssignCaptainFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<AssignCaptainFormValues>({
    resolver: zodResolver(assignCaptainSchema),
    defaultValues: {
      captain: "",
    },
  });

  const handleSubmit = async (values: AssignCaptainFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      toast({
        title: "Success",
        description: `Captain has been assigned to booking #${bookingId}`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to assign captain. Please try again.",
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
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Assigning..." : "Assign Captain"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AssignCaptainForm;
