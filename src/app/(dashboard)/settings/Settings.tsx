
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import PageHeader from "@/components/shared/PageHeader";

const Settings = () => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your application settings."
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the general settings for your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Clean City" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" defaultValue="support@cleancity.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="support-phone">Support Phone</Label>
                <Input id="support-phone" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="business-hours">Business Hours</Label>
                <Input id="business-hours" defaultValue="Monday to Friday, 9:00 AM - 6:00 PM" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="operating-status" defaultChecked />
                <Label htmlFor="operating-status">Currently Operating</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Pricing</CardTitle>
              <CardDescription>
                Manage subscription plans and pricing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Basic Plan</h3>
                    <p className="text-sm text-muted-foreground">For small homes and apartments</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-24" defaultValue="$49.99" />
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="mb-2">Services Included</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="basic-home-cleaning" defaultChecked />
                      <Label htmlFor="basic-home-cleaning">Basic Home Cleaning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="basic-car-wash" />
                      <Label htmlFor="basic-car-wash">Basic Car Wash</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Premium Plan</h3>
                    <p className="text-sm text-muted-foreground">For larger homes and complete service</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-24" defaultValue="$99.99" />
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="mb-2">Services Included</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="premium-home-cleaning" defaultChecked />
                      <Label htmlFor="premium-home-cleaning">Deep Home Cleaning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="premium-car-wash" defaultChecked />
                      <Label htmlFor="premium-car-wash">Premium Car Detailing</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="premium-kitchen" defaultChecked />
                      <Label htmlFor="premium-kitchen">Kitchen Deep Clean</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Pricing</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-3 text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-new-booking">New Booking</Label>
                      <Switch id="email-new-booking" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-booking-cancelled">Booking Cancelled</Label>
                      <Switch id="email-booking-cancelled" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-booking-completed">Booking Completed</Label>
                      <Switch id="email-booking-completed" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-payment-received">Payment Received</Label>
                      <Switch id="email-payment-received" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-3 text-lg font-medium">SMS Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-new-booking">New Booking</Label>
                      <Switch id="sms-new-booking" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-booking-cancelled">Booking Cancelled</Label>
                      <Switch id="sms-booking-cancelled" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-booking-reminder">Booking Reminder</Label>
                      <Switch id="sms-booking-reminder" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-3 text-lg font-medium">Captain Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="captain-new-assignment">New Assignment</Label>
                      <Switch id="captain-new-assignment" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="captain-schedule-change">Schedule Change</Label>
                      <Switch id="captain-schedule-change" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Notifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Integrations</CardTitle>
              <CardDescription>
                Manage your third-party service integrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-blue-100 p-1">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                        <path d="M4 4h16v16H4V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Payment Gateway</h3>
                      <p className="text-sm text-muted-foreground">Process payments securely</p>
                    </div>
                  </div>
                  <Switch id="payment-integration" defaultChecked />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input id="api-key" type="password" defaultValue="sk_test_4eC39HqLyjWDarjtT1zdp7dc" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" defaultValue="https://cleancity.com/webhook/payments" />
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-green-100 p-1">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
                        <path d="M21 5L2 11l7 3 11-6-8 8 7 3 3-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">SMS Service</h3>
                      <p className="text-sm text-muted-foreground">Send notifications and alerts</p>
                    </div>
                  </div>
                  <Switch id="sms-integration" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="sms-api-key">API Key</Label>
                    <Input id="sms-api-key" type="password" defaultValue="" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="sms-from">From Number</Label>
                    <Input id="sms-from" defaultValue="" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Integrations</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Settings;
