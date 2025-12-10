"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createProduct, deleteProduct } from "@/lib/actions/products"
import { formatCurrency } from "@/lib/utils"
import { Plus, Search, Package, Trash2, Edit } from "lucide-react"

type Product = {
    id: string
    name: string
    sku?: string | null
    description?: string | null
    price: number | string
    quantity: number
    isActive: boolean
}

interface ProductsClientProps {
    products: Product[]
}

export function ProductsClient({ products }: ProductsClientProps) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        description: "",
        price: "",
        quantity: "0",
    })

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createProduct({
                name: formData.name,
                sku: formData.sku || undefined,
                description: formData.description || undefined,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity) || 0,
            })
            setIsModalOpen(false)
            setFormData({ name: "", sku: "", description: "", price: "", quantity: "0" })
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return
        try {
            await deleteProduct(id)
            router.refresh()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Products"
                description="Manage your products and services catalog"
                actions={
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        New Product
                    </Button>
                }
            />

            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Product</th>
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">SKU</th>
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Price</th>
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Quantity</th>
                                    <th className="text-left text-sm font-medium text-slate-400 p-4">Status</th>
                                    <th className="text-right text-sm font-medium text-slate-400 p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-slate-800">
                                                    <Package className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{product.name}</p>
                                                    {product.description && (
                                                        <p className="text-sm text-slate-400 truncate max-w-xs">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">{product.sku || "-"}</td>
                                        <td className="p-4 text-blue-400 font-medium">
                                            {formatCurrency(Number(product.price))}
                                        </td>
                                        <td className="p-4 text-slate-300">{product.quantity}</td>
                                        <td className="p-4">
                                            <Badge variant={product.isActive ? "success" : "outline"}>
                                                {product.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-400">
                                            No products found. Add your first product to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Product"
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Product Name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="SKU"
                            placeholder="e.g. PRD-001"
                            value={formData.sku}
                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        />
                        <Input
                            label="Price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>
                    <Input
                        label="Quantity"
                        type="number"
                        placeholder="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                    <Textarea
                        label="Description"
                        placeholder="Product description..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            Create Product
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
