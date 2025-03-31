import CustomerDetail from "./CustomerDetail";
import { getCustomerById } from "../server/actions/customer";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const customer = await getCustomerById(id);
    console.log(customer)
    return <CustomerDetail customer={customer.data} />
}
