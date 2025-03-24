import { getBookings } from "./server/actions/bookings";
import Bookings from "./Bookings";

export default async function Page() {
    const bookings = await getBookings();
    return <Bookings bookings={bookings.data}/>
}
