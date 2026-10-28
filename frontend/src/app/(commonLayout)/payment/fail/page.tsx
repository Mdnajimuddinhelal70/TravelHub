import { XCircle } from "lucide-react";
import Link from "next/link";

const PaymentFailPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string; message?: string }>;
}) => {
  const { transactionId, message } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <XCircle className="h-9 w-9" />
      </div>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-950">
        Payment Failed
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {message || "Your payment could not be completed. Please try again."}
      </p>
      {transactionId && (
        <p className="mt-4 rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-slate-600">
          {transactionId}
        </p>
      )}
      <div className="mt-8 flex w-full flex-col gap-3">
        <Link
          href="/tours"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-sm font-bold text-white shadow-md"
        >
          Try again
        </Link>
        <Link
          href="/my-bookings"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm"
        >
          View my bookings
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailPage;
