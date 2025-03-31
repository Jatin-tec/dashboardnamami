import { getServicesId } from "../server/actions/services";
import ServiceDetail from "./ServiceDetail";

export default async function Page({ params }: { params: Promise<{ service_code: string }> }) {
  const { service_code } = await params;
  const subscription = await getServicesId(service_code);

  console.log("subscription", subscription);

  return <ServiceDetail subscription={subscription.data} />
}
