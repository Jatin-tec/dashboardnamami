import { getBookingsById } from "../server/actions/bookings";
import BookingDetail from "./BookingDetail";

export default async function Page({ params }: { params: Promise<{ booking_id: string }> }) {
  const { booking_id } = await params;


  const booking = await getBookingsById(booking_id);

  console.log(booking);

  return <BookingDetail booking={booking.data} />
}
