import { getSubscriptions } from "./server/actions/services";
import Services from "./Services";

export default async function Page() {
    const subscriptions = await getSubscriptions();

    return <Services subscriptions={subscriptions.data} />
}
