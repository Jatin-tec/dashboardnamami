import { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getFormFields } from "@/app/(dashboard)/customers/server/actions/customer";
import { FormFieldConfig } from "@/types/generic";
import { getStates } from "@/lib/common/state";
import { getCities } from "@/lib/common/city";
import { City, State } from "@/types/types";

// Base schema for static fields
const staticSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone_number: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone format")
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters").max(200),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
});

type CustomerFormValues = z.infer<typeof staticSchema> & Record<string, string | number | undefined>;

interface CustomerFormProps {
  initialData?: Partial<CustomerFormValues>;
  onSubmit: (data: CustomerFormValues) => void;
  onCancel: () => void;
}

const CustomerForm = ({
  initialData = {},
  onSubmit,
  onCancel,
}: CustomerFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicFields, setDynamicFields] = useState<FormFieldConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [states, setStates] = useState<State[]>([]);
  const [cityList, setCityList] = useState<City[]>([]);

  useEffect(() => {
    const fetchFormFields = async () => {
      const formFields = await getFormFields();
      console.log(formFields, 'formFields')
      if (formFields.status === "success" && formFields.data) {
        setDynamicFields(formFields.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load form fields",
          variant: "destructive",
        });
      }
      const response = await getStates();
      if (response.status === "success" && response.data) {
        setStates(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load states",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };
    fetchFormFields();
  }, [toast]);


  const dynamicSchema = useMemo(() => {
    const schemaObject: Record<string, z.ZodTypeAny> = {};

    dynamicFields.forEach((field) => {
      if (['name', 'email', 'phone_number', 'address', 'state', 'state', 'city'].includes(field.api_value)) return;

      let fieldSchema: z.ZodTypeAny = z.unknown();

      switch (field.field_type) {
        case 'text':
          fieldSchema = z.string();
          break;
        case 'number':
          fieldSchema = z.number();
          break;
        case 'date':
          fieldSchema = z.date();
          break;
        case 'boolean':
          fieldSchema = z.boolean();
          break;
        case 'select':
          fieldSchema = z.string();
          break;
        case 'multiselect':
          fieldSchema = z.array(z.string());
          break;
        case 'file':
          fieldSchema = z.instanceof(File);
          break;
      }

      if (field.is_required) {
        if (fieldSchema instanceof z.ZodString || fieldSchema instanceof z.ZodNumber) fieldSchema = fieldSchema.min(1, `${field.field_name} is required`);
      } else {
        fieldSchema = fieldSchema.optional().or(z.literal(''));
      }

      schemaObject[field.api_value] = fieldSchema;
    });

    return z.object(schemaObject);
  }, [dynamicFields]);

  const customerSchema = staticSchema.merge(dynamicSchema);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      phone_number: initialData.phone_number || "",
      address: initialData.address || "",
      state: initialData.state || "",
      city: initialData.city || "",
    }
  });

  useEffect(() => {
    const fetchCitiesForState = async () => {
      const selectedStateId = form.getValues('state');
      if (selectedStateId) {
        try {
          const response = await getCities({ state_id: Number(selectedStateId) });
          if (response.status === "success" && response.data) {
            setCityList(response.data);
            // Reset city field when state changes
            form.resetField('city', { defaultValue: '' });
          } else {
            toast({
              title: "Error",
              description: "Failed to load cities",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load cities",
            variant: "destructive",
          });
        }
      }
    };

    // Fetch cities whenever state changes
    const subscription = form.watch((value, { name }) => {
      if (name === 'state') {
        fetchCitiesForState();
      }
    });

    return () => subscription.unsubscribe();
  }, [form, toast]);

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      toast({
        title: "Success",
        description: "Customer has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading form...</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Static Fields */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="customer@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 555-123-4567" {...field} />
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter full address"
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
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cityList.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dynamic Fields */}
        {dynamicFields
          .filter(field => !['name', 'email', 'phone_number', 'address', 'state', 'city'].includes(field.api_value))
          .map((field) => (
            <FormField
              key={field.api_value}
              control={form.control}
              name={field.api_value}
              render={({ field: renderField }) => (
                <FormItem>
                  <FormLabel>{field.field_name}</FormLabel>
                  <FormControl>
                    {field.field_type === 'select' ? (
                      <Select
                        onValueChange={renderField.onChange}
                        value={renderField.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.field_name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.field_type === 'textarea' ? (
                      <Textarea
                        placeholder={field.help_text || ""}
                        {...renderField}
                      />
                    ) : (
                      <Input
                        type={field.field_type}
                        placeholder={field.help_text || ""}
                        {...renderField}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;