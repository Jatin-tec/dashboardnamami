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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define form schema with Zod
const subscriptionTypeSchema = z.object({
  name: z.string().min(2, "Subscription name must be at least 2 characters"),
  service: z.string().min(1, "Service is required"),
  frequency: z.number().int().positive("Frequency must be a positive integer"),
  price: z.number().positive("Price must be a positive number"),
  is_active: z.boolean().default(true),
});

type SubscriptionTypeFormValues = z.infer<typeof subscriptionTypeSchema>;

interface SubscriptionTypeFormProps {
  initialData?: Partial<SubscriptionTypeFormValues>;
  services?: { service_code: string; name: string }[];
  onSubmit: (data: SubscriptionTypeFormValues) => void;
  onCancel: () => void;
}

const SubscriptionTypeForm = ({
  initialData = {},
  services = [],
  onSubmit,
  onCancel,
}: SubscriptionTypeFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<SubscriptionTypeFormValues>({
    resolver: zodResolver(subscriptionTypeSchema),
    defaultValues: {
      name: initialData.name || "",
      service: initialData.service || "",
      frequency: initialData.frequency || 1,
      price: initialData.price || 0,
      is_active:
        initialData.is_active !== undefined ? initialData.is_active : true,
    },
  });

  const handleSubmit = async (values: SubscriptionTypeFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      toast({
        title: "Success",
        description: "Subscription type has been saved successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save subscription type. Please try again.",
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
              <FormLabel>Subscription Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter subscription name" {...field} />
              </FormControl>
              <FormDescription>
                The name of the subscription plan
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem
                      key={service.service_code}
                      value={service.service_code}
                    >
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The service this subscription applies to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency (days)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Days between services"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                  value={field.value}
                />
              </FormControl>
              <FormDescription>
                How often the service is provided (in days)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <FormDescription>
                  Whether this subscription plan is currently active
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Subscription Type"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubscriptionTypeForm;
