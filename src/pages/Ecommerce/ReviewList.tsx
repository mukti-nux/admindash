import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { reviewService, Review } from "../../services/reviewService";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";

export default function ReviewList() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewService.getAll();
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await reviewService.delete(id);
                fetchReviews();
            } catch (error) {
                console.error("Error deleting review:", error);
            }
        }
    };

    return (
        <>
            <PageMeta
                title="Review Management | TailAdmin"
                description="Manage your product reviews"
            />
            <PageBreadcrumb pageTitle="Reviews" />
            <div className="space-y-6">
                <ComponentCard title="Product Reviews">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Product</TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Rating</TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Comment</TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="px-5 py-4 text-center">Loading...</TableCell>
                                        </TableRow>
                                    ) : reviews.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="px-5 py-4 text-center">No reviews found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        reviews.map((review) => (
                                            <TableRow key={review.id}>
                                                <TableCell className="px-5 py-4 text-start">
                                                    <div className="flex items-center gap-3">
                                                        {review.avatar && (
                                                            <img src={review.avatar} alt={review.user_name} className="w-8 h-8 rounded-full border border-gray-200" />
                                                        )}
                                                        <span className="font-medium text-gray-800 dark:text-white/90">{review.user_name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{review.product?.title || "N/A"}</TableCell>
                                                <TableCell className="px-5 py-4 text-start">
                                                    <Badge color={review.rating >= 4 ? "success" : review.rating >= 3 ? "warning" : "error"}>
                                                        {review.rating} ⭐
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                                                    <p className="max-w-xs truncate">{review.comment}</p>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-start">
                                                    <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </>
    );
}
