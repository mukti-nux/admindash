import { useEffect, useState } from "react";
import { reviewService, Review } from "../../services/reviewService";
import Badge from "../ui/badge/Badge";

export default function LatestReviewsSupabase() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const data = await reviewService.getAll();
                setReviews(data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching latest reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Latest Reviews
            </h3>
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center py-4">Loading...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-center py-4 text-gray-400">No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="flex gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
                                {review.avatar ? (
                                    <img src={review.avatar} alt={review.user_name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">U</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                                        {review.user_name}
                                    </h4>
                                    <Badge size="sm" color={review.rating >= 4 ? "success" : "warning"}>
                                        {review.rating} ⭐
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 italic">
                                    on {review.products?.title || "Unknown Product"}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    "{review.comment}"
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
