import Customers from "./components/Customers";
import { getCustomers } from "./server/actions/customer";

export default async function Page() {
    const customers = await getCustomers();
    console.log(customers, 'customers');
    return <Customers customers={customers.data}/>
}
