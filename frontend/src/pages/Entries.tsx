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
import { PackagePlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

interface Entry {
  id: number;
  product: string;
  quantity: number;
  cost: number;
  date: string;
}

const Entries = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([]);
  const [newEntry, setNewEntry] = useState({
    product: "",
    quantity: "",
    cost: "",
  });

  // Fetch para carregar entradas
  const fetchEntries = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/entries/");
      if (!response.ok) {
        throw new Error("Erro ao carregar entradas");
      }
      const data = await response.json();
      const sanitizedData = data.map((entry: any) => ({
        ...entry,
        cost: parseFloat(entry.cost) || 0, // Certifica que `cost` é um número
      }));
      setEntries(sanitizedData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as entradas.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Manipular entrada do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submeter nova entrada
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/entries/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newEntry,
          quantity: parseInt(newEntry.quantity),
          cost: parseFloat(newEntry.cost),
          date: new Date().toISOString(),
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao registrar entrada");
      }
  
      const savedEntry = await response.json();
      setEntries((prevEntries) => [savedEntry, ...prevEntries]);
      toast({
        title: "Entrada registrada",
        description: `Entrada do produto "${newEntry.product}" salva com sucesso.`,
      });
  
      setNewEntry({ product: "", quantity: "", cost: "" });
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-white">
      <div className="flex-1 p-4">
      <Header />
        <div className="max-w-6xl mx-auto mt-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Registro de Entradas</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Nova Entrada
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Registrar Nova Entrada</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="product">Produto</Label>
                    <Input
                      type="text"
                      id="product"
                      name="product"
                      value={newEntry.product}
                      onChange={handleInputChange}
                      required
                    />
                    {productSuggestions.length > 0 && (
                      <ul className="bg-white border mt-2 max-h-32 overflow-y-auto">
                        {productSuggestions.map((product) => (
                          <li
                            key={product.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setNewEntry({ ...newEntry, product: product.name })}
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
                      value={newEntry.quantity}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="cost">Custo do Produto</Label>
                    <Input
                      type="number"
                      id="cost"
                      name="cost"
                      value={newEntry.cost}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Salvar Entrada
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
                    <TableHead>Custo</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.product}</TableCell>
                      <TableCell>{entry.quantity}</TableCell>
                      <TableCell>
                        {typeof entry.cost === "number"
                          ? `R$ ${entry.cost.toFixed(2)}`
                          : "Valor não disponível"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(entry.date), "dd/MM/yyyy HH:mm")}
                      </TableCell>
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

export default Entries;
