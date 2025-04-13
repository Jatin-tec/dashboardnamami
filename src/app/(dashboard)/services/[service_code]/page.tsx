import { getServicesDetail } from "../server/actions/services";
import ServiceDetail from "./ServiceDetail";

export default async function Page({ params }: { params: Promise<{ service_code: string }> }) {
  const { service_code } = await params;
  const service = await getServicesDetail(service_code);

  console.log("subscription", service);

  return <ServiceDetail service={service.data} />
}
