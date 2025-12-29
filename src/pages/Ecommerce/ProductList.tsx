import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { productService, Product } from "../../services/productService";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import ProductForm from "../../components/ecommerce/ProductForm";

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAll();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productService.delete(id);
                fetchProducts();
            } catch (error) {
                alert("Error deleting product: " + (error as any).message);
            }
        }
    };

    const handleSave = async (formData: any) => {
        try {
            if (editingProduct) {
                await productService.update(editingProduct.id, formData);
            } else {
                await productService.create(formData);
            }
            setShowForm(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            alert("Error saving product: " + (error as any).message);
        }
    };

    const openAddForm = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const openEditForm = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    return (
        <>
            <PageMeta
                title="Product Management | TailAdmin"
                description="Manage your products"
            />
            <PageBreadcrumb pageTitle="Products" />
            <div className="space-y-6">
                <ComponentCard title="Product List">
                    <div className="mb-4">
                        <button
                            onClick={openAddForm}
                            className="px-4 py-2 text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            Add New Product
                        </button>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Title</TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Category</TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Price</TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Stock</TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 text-end">Action</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="px-5 py-4 text-center">Loading...</TableCell>
                                        </TableRow>
                                    ) : products.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="px-5 py-4 text-center">No products found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        products.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="px-5 py-4 text-start">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                            {product.image_url ? (
                                                                <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-gray-800 dark:text-white/90">{product.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">{product.category}</TableCell>
                                                <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">${product.price}</TableCell>
                                                <TableCell className="px-5 py-4 text-start">
                                                    <Badge color={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"}>
                                                        {product.stock}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-end">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => openEditForm(product)} className="text-blue-500 hover:text-blue-700">Edit</button>
                                                        <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                                    </div>
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

            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </>
    );
}
