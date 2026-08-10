import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStarArray } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
  className,
}: StarRatingProps) {
  const stars = getStarArray(rating);

  const sizeMap = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {stars.map((fill, i) => (
          <span key={i} className="relative inline-block">
            <Star
              className={cn(sizeMap[size], "text-neutral-200 fill-neutral-200")}
            />
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: fill === 0.5 ? "50%" : "100%" }}
              >
                <Star
                  className={cn(sizeMap[size], "text-amber-400 fill-amber-400")}
                />
              </span>
            )}
          </span>
        ))}
      </div>
      {showCount && (
        <span className={cn("text-neutral-500", textSizeMap[size])}>
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="ml-1">({reviewCount.toLocaleString()})</span>
          )}
        </span>
      )}
    </div>
  );
}
