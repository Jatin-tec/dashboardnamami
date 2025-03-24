'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';

import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import StatusBadge from "@/components/shared/StatusBadge";
import { serviceAttributes } from "@/data/mock";
import { SubscriptionType } from '@/types/types';

const ServiceDetail = ({ subscription }: { subscription: SubscriptionType | null }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    console.log(subscription, 'subscription')

    const handleEdit = () => {
        toast({
            title: "Edit service",
            description: `Editing service: ${subscription?.name}`,
        });
    };

    const handleDelete = () => {
        toast({
            title: "Service deleted",
            description: `Service ${subscription?.name} has been deleted.`,
            variant: "destructive",
        });
        setIsDeleteDialogOpen(false);
        router.push("/services");
    };

    // Generate random attributes for the service
    const randomAttributes = serviceAttributes.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 3));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.push("/services")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">{subscription?.name}</h1>
                    <StatusBadge status={subscription?.is_active ? 'Active' : 'Inactive'} />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Details</CardTitle>
                            <CardDescription>Complete information about this service.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                                    <p>{subscription?.service.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                                    <p>{subscription?.price}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Frequency</h3>
                                    <p>{subscription?.frequency}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                    <StatusBadge status={subscription?.is_active ? 'Active' : 'Inactive'} />
                                </div>
                            </div>

                            {subscription?.service.description && <div>
                                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Description</h3>
                                <p>{subscription?.service.description}</p>
                            </div>}

                            <div>
                                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Service Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    {randomAttributes.map((attribute, index) => (
                                        <Badge key={index} variant="outline">
                                            {attribute}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Alert>
                        <AlertTitle>Booking Statistics</AlertTitle>
                        <AlertDescription>
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Last 7 days:</span>
                                    <span className="font-medium">{Math.floor(Math.random() * 20) + 5}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Last 30 days:</span>
                                    <span className="font-medium">{Math.floor(Math.random() * 50) + 20}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">All time:</span>
                                    <span className="font-medium">{Math.floor(Math.random() * 500) + 100}</span>
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Service</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this service? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ServiceDetail;
