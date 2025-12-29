import { useEffect, useState } from "react";
import { BoxIconLine, GroupIcon } from "../../icons";
import { productService, Product } from "../../services/productService";
import { reviewService } from "../../services/reviewService";

export default function SupabaseAnalytics() {
    const [metrics, setMetrics] = useState({
        products: 0,
        reviews: 0,
        avgRating: 0,
        outOfStock: 0
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const [productCount, reviewCount, avgRating, products] = await Promise.all([
                    productService.getCount(),
                    reviewService.getCount(),
                    reviewService.getAverageRating(),
                    productService.getAll()
                ]);

                const outOfStock = products.filter((p: Product) => (p.stock || 0) <= 0).length;

                setMetrics({
                    products: productCount,
                    reviews: reviewCount,
                    avgRating: avgRating,
                    outOfStock: outOfStock
                });
            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
        };

        fetchMetrics();
    }, []);

    const metricItems = [
        {
            label: "Total Products",
            value: metrics.products,
            icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
            color: "bg-blue-100 dark:bg-blue-500/10",
        },
        {
            label: "Total Reviews",
            value: metrics.reviews,
            icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
            color: "bg-gray-100 dark:bg-gray-800",
        },
        {
            label: "Average Rating",
            value: metrics.avgRating.toFixed(1),
            icon: <StarIcon className="text-yellow-500 size-6" />,
            color: "bg-yellow-100 dark:bg-yellow-500/10",
        },
        {
            label: "Out of Stock",
            value: metrics.outOfStock,
            icon: <BoxIconLine className="text-red-500 size-6" />,
            color: "bg-red-100 dark:bg-red-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {metricItems.map((item, index) => (
                <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${item.color}`}>
                        {item.icon}
                    </div>

                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {item.label}
                            </span>
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                                {item.value}
                            </h4>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function StarIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
