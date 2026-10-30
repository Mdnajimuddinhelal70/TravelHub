import BookingManagementTable from "@/components/modules/Admin/Booking/BookingManagementTable";
import { getAllBookings } from "@/services/booking/getAllBookings";

const BookingManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
    limit?: string;
  }>;
}) => {
  const params = await searchParams;

  const { bookings, meta } = await getAllBookings({
    search: params.search,
    status: params.status,
    page: params.page ?? "1",
    limit: params.limit ?? "15",
    sort: "-createdAt",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
          Booking Management
        </h1>
        <p className="text-sm text-slate-600">
          View, confirm, or cancel customer bookings across all tours.
        </p>
      </div>
      <BookingManagementTable bookings={bookings} meta={meta} />
    </div>
  );
};

export default BookingManagementPage;
