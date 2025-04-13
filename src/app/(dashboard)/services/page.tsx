import { getServices } from "./server/actions/services";
import Services from "./components/Services";

export default async function Page() {
    const services = await getServices();

    console.log(services);
    return <Services services={services.data} />
}
