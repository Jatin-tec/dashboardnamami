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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define form schema with Zod
const stateSchema = z.object({
  name: z.string().min(2, "State name must be at least 2 characters"),
});

type StateFormValues = z.infer<typeof stateSchema>;

interface StateFormProps {
  initialData?: Partial<StateFormValues>;
  onSubmit: (data: StateFormValues) => void;
  onCancel: () => void;
}

const StateForm = ({
  initialData = {},
  onSubmit,
  onCancel,
}: StateFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<StateFormValues>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      name: initialData.name || "",
    },
  });

  const handleSubmit = async (values: StateFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      toast({
        title: "Success",
        description: "State has been saved successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save state. Please try again.",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter state name" {...field} />
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
            {isSubmitting ? "Saving..." : "Save State"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StateForm;
