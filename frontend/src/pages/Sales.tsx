import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

interface Sale {
  id: number;
  product: string;
  quantity: number;
  date: string;
  total_venda: number;
  funcionario: string;
}

interface Product {
  id: number;
  name: string;
}

const Sales = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([]);
  const [newSale, setNewSale] = useState({
    product: "",
    quantity: "",
    total_venda: "",
    funcionario: "",
  });

  // Fetch para carregar vendas
  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/sales/");
      if (!response.ok) throw new Error("Erro ao buscar vendas");
      const data = await response.json();
      setSales(data);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar as vendas.", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Manipular entrada do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));

    // Buscar sugestões se for o campo de produto
    if (name === "product" && value.length > 1) {
      fetchProductSuggestions(value);
    } else {
      setProductSuggestions([]); // Limpa sugestões se vazio
    }
  };

  // Buscar sugestões de produtos
  const fetchProductSuggestions = async (query: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/search/?q=${query}`);
      if (!response.ok) throw new Error("Erro ao buscar produtos");
      const data = await response.json();
      setProductSuggestions(data);
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao buscar produtos.", variant: "destructive" });
    }
  };

  // Enviar venda para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/sales/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSale,
          quantity: parseInt(newSale.quantity),
          total_venda: parseFloat(newSale.total_venda),
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Erro ao registrar venda");

      const savedSale = await response.json();
      setSales((prevSales) => [...prevSales, savedSale]);
      toast({ title: "Venda registrada", description: `Venda do produto "${newSale.product}" salva com sucesso.` });

      setNewSale({ product: "", quantity: "", total_venda: "", funcionario: "" });
      setProductSuggestions([]);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível registrar a venda.", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-white">
      <div className="flex-1 p-4">
      <Header />
        <div className="max-w-6xl mx-auto mt-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Registro de Vendas</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Nova Venda
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Registrar Nova Venda</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="product">Produto</Label>
                    <Input
                      type="text"
                      id="product"
                      name="product"
                      value={newSale.product}
                      onChange={handleInputChange}
                      required
                    />
                    {productSuggestions.length > 0 && (
                      <ul className="bg-white border mt-2 max-h-32 overflow-y-auto">
                        {productSuggestions.map((product) => (
                          <li
                            key={product.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setNewSale({ ...newSale, product: product.name })}
                          >
                            {product.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={newSale.quantity}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="total_venda">Valor Total</Label>
                    <Input
                      type="number"
                      id="total_venda"
                      name="total_venda"
                      value={newSale.total_venda}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="funcionario">Funcionário</Label>
                    <Input
                      type="text"
                      id="funcionario"
                      name="funcionario"
                      value={newSale.funcionario}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Salvar Venda
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Funcionário</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>
                        {format(new Date(sale.date), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        {sale.total_venda ? `R$ ${Number(sale.total_venda).toFixed(2)}` : "Valor indisponível"}
                      </TableCell>
                      <TableCell>{sale.funcionario}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sales;
