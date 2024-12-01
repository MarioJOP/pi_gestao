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

const Stock = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);

  // Fetch produtos do backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/products/");
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await response.json();

      // Verifica se o retorno é um array válido
      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida da API");
      }
      setProducts(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
      });
      setProducts([]); // Define lista vazia em caso de erro
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

  // Atualizar preço do produto
  const handleUpdatePrice = async (productId: number) => {
    const newPrice = prompt("Digite o novo preço:");
    if (newPrice && !isNaN(Number(newPrice))) {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${productId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price: parseFloat(newPrice) }),
        });

        if (response.ok) {
          const updatedProduct = await response.json();
          setProducts(
            products.map((product) =>
              product.id === productId ? updatedProduct : product
            )
          );
          toast({
            title: "Preço atualizado",
            description: `Preço do produto ${updatedProduct.name} foi atualizado para R$ ${newPrice}.`,
          });
        } else {
          throw new Error("Erro ao atualizar o preço");
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o preço do produto.",
        });
      }
    } else {
      toast({
        title: "Aviso",
        description: "Preço inválido.",
      });
    }
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
                <TableHead>Preço</TableHead>
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
                    <TableCell>
                      {product.price != null && !isNaN(Number(product.price))
                        ? `R$ ${Number(product.price).toFixed(2)}`
                        : "Preço indisponível"}
                    </TableCell>
                    <TableCell>{product.quantity || "Não especificado"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdatePrice(product.id)}
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
      </div>
    </div>
  );
};

export default Stock;
