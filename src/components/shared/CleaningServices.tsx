
import { SprayCan, Car, Brush, Trash } from "lucide-react";

// This component defines the icons for different service types
// which can be used across the application

export const getServiceIcon = (serviceName: string) => {
  const serviceType = serviceName.toLowerCase();

  if (serviceType.includes("home") || serviceType.includes("house")) {
    return <SprayCan className="h-5 w-5" />;
  } else if (serviceType.includes("car") || serviceType.includes("auto")) {
    return <Car className="h-5 w-5" />;
  } else if (serviceType.includes("deep") || serviceType.includes("kitchen") || serviceType.includes("bathroom")) {
    return <Brush className="h-5 w-5" />;
  } else if (serviceType.includes("waste") || serviceType.includes("trash") || serviceType.includes("removal")) {
    return <Trash className="h-5 w-5" />;
  }

  // Default icon
  return <SprayCan className="h-5 w-5" />;
};
