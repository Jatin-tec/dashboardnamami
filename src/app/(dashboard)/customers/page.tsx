import Customers from "./components/Customers";
import { getCustomers } from "./server/actions/customer";

export default async function Page() {
    const customers = await getCustomers();
    return <Customers customers={customers.data}/>
}
