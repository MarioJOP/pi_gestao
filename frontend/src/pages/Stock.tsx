import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Stock = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null); // Produto em edição
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controle do modal

  // Fetch produtos do backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/products/");
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida da API");
      }
      setProducts(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
      });
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Excluir produto
  const handleDelete = async (productId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast({
          title: "Produto excluído",
          description: `Produto ${productId} foi removido com sucesso.`,
        });
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        throw new Error("Erro ao excluir o produto");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
      });
    }
  };

  // Atualizar produto
  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${editProduct.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editProduct),
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(
          products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
        toast({
          title: "Produto atualizado",
          description: `O produto "${updatedProduct.name}" foi atualizado com sucesso.`,
        });
        setIsDialogOpen(false); // Fecha o modal
      } else {
        throw new Error("Erro ao atualizar o produto");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto.",
      });
    }
  };

  // Abrir modal para edição
  const openEditModal = (product) => {
    setEditProduct({ ...product }); // Clonar o produto para edição
    setIsDialogOpen(true);
  };

  return (
    <div className="flex-1">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Estoque de Produtos</h1>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço de Compra</TableHead>
                <TableHead>Preço de Venda</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</TableCell>
                    <TableCell>
                      {product.buy_price != null && !isNaN(Number(product.buy_price))
                        ? `R$ ${Number(product.buy_price).toFixed(2)}`
                        : "Preço de Compra indisponível"}
                    </TableCell>
                    <TableCell>
                      {product.sale_price != null && !isNaN(Number(product.sale_price))
                        ? `R$ ${Number(product.sale_price).toFixed(2)}`
                        : "Preço de Venda indisponível"}
                    </TableCell>
                    <TableCell>{product.quantity || "Não especificado"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditModal(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal de edição */}
        {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="p-6 rounded-lg shadow-lg max-w-lg mx-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Editar Produto
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Produto
                </label>
                <Input
                  id="productName"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="Nome do produto"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />
              </div>
              
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fornecedor
                </label>
                <Input
                  id="productName"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="Nome do produto"
                  value={editProduct.supplier}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="buyPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Preço de Compra
                </label>
                <Input
                  id="buyPrice"
                  type="number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="Preço de compra"
                  value={editProduct.buy_price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, buy_price: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="salePrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Preço de Venda
                </label>
                <Input
                  id="salePrice"
                  type="number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="Preço de venda"
                  value={editProduct.sale_price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, sale_price: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantidade
                </label>
                <Input
                  id="quantity"
                  type="number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="Quantidade"
                  value={editProduct.quantity}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, quantity: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end mt-6 space-x-4">
              <Button
                variant="secondary"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleUpdateProduct}
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      </div>
    </div>
  );
};

export default Stock;
