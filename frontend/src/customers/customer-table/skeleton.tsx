import { Skeleton } from "~/components/ui/skeleton";

export const CustomerTableSkeleton = () => {
  // Create an array of 5 items to represent skeleton rows
  const skeletonRows = Array(5).fill(null);

  return (
    <div className="w-full p-6 space-y-4">
      {/* Filter and column header skeletons */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Table header skeleton */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <Skeleton className="h-5 w-32" /> {/* Name */}
        <Skeleton className="h-5 w-40" /> {/* Date of Birth */}
        <Skeleton className="h-5 w-20" /> {/* Gender */}
        <Skeleton className="h-5 w-36" /> {/* Mobile Number */}
        <Skeleton className="h-5 w-44" /> {/* Email */}
        <div className="flex-1" />
        <Skeleton className="h-5 w-16" /> {/* Edit */}
      </div>

      {/* Table rows skeleton */}
      {skeletonRows.map((_, index) => (
        <div key={index} className="flex items-center gap-4 py-4 border-b">
          <Skeleton className="h-5 w-32" /> {/* Name */}
          <Skeleton className="h-5 w-40" /> {/* Date of Birth */}
          <Skeleton className="h-5 w-16 rounded-full" /> {/* Gender badge */}
          <Skeleton className="h-5 w-36" /> {/* Mobile Number */}
          <Skeleton className="h-5 w-44" /> {/* Email */}
          <div className="flex-1" />
          <Skeleton className="h-5 w-16" /> {/* Edit button */}
        </div>
      ))}

      {/* Pagination skeleton */}
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-5 w-36" /> {/* Customer count */}
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" /> {/* Previous */}
          <Skeleton className="h-8 w-20" /> {/* Next */}
        </div>
      </div>
    </div>
  );
};

export default CustomerTableSkeleton;
