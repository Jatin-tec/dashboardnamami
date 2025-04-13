
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { Captain, City, Customer, SubscriptionType } from "@/types/types";
import { getCaptains, getCustomers, getSubscriptions } from "@/app/(dashboard)/bookings/server/actions/bookings";
import { getCities } from "@/lib/common/city";

// Define form schema with Zod
const bookingSchema = z.object({
  city: z.string().min(1, "City is required"),
  customer: z.string().min(1, "Customer is required"),
  service: z.string().min(1, "Service is required"),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, "Time is required"),
  address: z.string().optional(),
  captain: z.string().optional(),
  notes: z.string().optional(),
  create_subscription: z.boolean().default(false),
  subscription_type: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  initialData?: Partial<BookingFormValues>;
  onSubmit: (data: BookingFormValues) => void;
  onCancel: () => void;
}

const BookingForm = ({
  initialData = {},
  onSubmit,
  onCancel,
}: BookingFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCity, setSelectedCity] = useState(initialData.city || "");

  const [cities, setCities] = useState<City[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<SubscriptionType[]>([]);
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      const response = await getCities();
      if (response.status === "success" && response.data) {
        setCities(response.data);
      } else {
        toast({
          title: "Error fetching cities",
          description: response.message,
          variant: "destructive",
        });
      }
    }
    fetchCities();
  }, [toast]);


  // Fetch data when city changes
  useEffect(() => {
    const fetchCityData = async () => {
      if (!selectedCity) return;

      console.log(selectedCity, 'selectedCity')
      setIsLoading(true);
      // Fetch customers, services and captains for selected city
      const [customersRes, servicesRes, captainsRes] = await Promise.all([getCustomers(selectedCity), getSubscriptions(selectedCity), getCaptains(selectedCity)]);
      if (customersRes.data && servicesRes.data && captainsRes.data) {
        setCustomers(customersRes.data);
        setServices(servicesRes.data);
        setCaptains(captainsRes.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch city data",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };
    fetchCityData();
  }, [selectedCity, toast]);

  // Initialize form with react-hook-form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer: initialData.customer || "",
      service: initialData.service || "",
      date: initialData.date ? new Date(initialData.date) : new Date(),
      time: initialData.time || "09:00",
      address: initialData.address || "",
      captain: initialData.captain || "",
      notes: initialData.notes || "",
      create_subscription: initialData.create_subscription || false,
      subscription_type: initialData.subscription_type || "",
    },
  });

  const handleSubmit = async (values: BookingFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      toast({
        title: "Success",
        description: "Booking has been created successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    form.setValue("city", cityId);
    // Reset dependent fields
    form.resetField("customer");
    form.resetField("service");
    form.resetField("captain");
  };



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select
                onValueChange={handleCityChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map((city, key) => (
                    <SelectItem key={key} value={city.id.toString()}>
                      {city.name}
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
          name="customer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedCity || isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    {isLoading ? (
                      <span>Loading customers...</span>
                    ) : (
                      <SelectValue placeholder="Select a customer" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
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
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedCity || isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    {isLoading ? (
                      <span>Loading services...</span>
                    ) : (
                      <SelectValue placeholder="Select a service" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((service, key) => (
                    <SelectItem key={key} value={service.id.toString()}>
                      {service.name} {service.service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Captain Field - Now depends on city */}
        <FormField
          control={form.control}
          name="captain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Captain (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedCity || isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    {isLoading ? (
                      <span>Loading captains...</span>
                    ) : (
                      <SelectValue placeholder="Assign a captain (optional)" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {captains.map((captain) => (
                    <SelectItem key={captain.id} value={captain.id.toString()}>
                      {captain.name} {captain.email}
                    </SelectItem>
                  ))}
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
                      initialFocus
                      disabled={(date) => date < new Date()}
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
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Address (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter full address where service will be performed"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special instructions or notes for this booking"
                  className="resize-none"
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
            {isSubmitting ? "Creating..." : "Create Booking"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;
