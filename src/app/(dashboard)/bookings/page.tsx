import { getBookings } from "./server/actions/bookings";
import Bookings from "./Bookings";

export default async function Page() {
    const bookings = await getBookings();
    console.log("bookings", bookings);

    return <Bookings bookings={bookings.data}/>
}
