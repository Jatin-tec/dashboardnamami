import { useToast } from "@/hooks/use-toast";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CustomerForm({ isCreateDialogOpen, setIsCreateDialogOpen }: { isCreateDialogOpen: boolean, setIsCreateDialogOpen: (value: boolean) => void }) {
    const { toast } = useToast();

    const handleCreateCustomer = () => {
        toast({
            title: "Customer created",
            description: "New customer has been added successfully.",
        });
        setIsCreateDialogOpen(false);
    };


    return <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                    Add a new customer to your database.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input
                        id="name"
                        placeholder="Full name"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Email address"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                        Phone
                    </Label>
                    <Input
                        id="phone"
                        placeholder="Phone number"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="state" className="text-right">
                        State
                    </Label>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="madhyapradesh">Madhya Pradesh</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="city" className="text-right">
                        City
                    </Label>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vidisha">Vidisha</SelectItem>
                            <SelectItem value="sagar">Sagar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pincode" className="text-right">
                        Pincode
                    </Label>
                    <Input
                        id="pincode"
                        type="number"
                        placeholder="Pincode"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                        Address
                    </Label>
                    <Input
                        id="address"
                        placeholder="Full address"
                        className="col-span-3"
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                </Button>
                <Button onClick={handleCreateCustomer}>
                    Add Customer
                </Button>
            </div>
        </DialogContent>
    </Dialog>
}