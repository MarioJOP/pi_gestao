import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
// import Header from "@/components/Header";
import { PackagePlus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  supplier: z.string().min(2, "Fornecedor deve ter pelo menos 2 caracteres"),
  buy_price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Preço deve ser um número maior que 0",
  }),
  sale_price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Preço deve ser um número maior que 0",
  }),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), {
    message: "Quantidade deve ser um número inteiro maior ou igual a 0",
  }),
});

const ProductEntry = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      supplier: "",
      buy_price: "",
      sale_price: "",
      quantity: "",
    },
  });

  // Função para enviar os dados para a API Django
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("http://localhost:8000/api/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          category: values.category,
          supplier: values.supplier,
          buy_price: parseFloat(values.buy_price),
          sale_price: parseFloat(values.sale_price),
          quantity: parseInt(values.quantity, 10),
        }),
      });

      if (response.ok) {
        toast({
          title: "Produto cadastrado com sucesso!",
          description: `${values.name} foi adicionado ao estoque.`,
        });
        form.reset();
      } else {
        console.log(response);
        toast({
          title: "Erro ao cadastrar produto",
          description: "Ocorreu um erro ao tentar adicionar o produto.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao cadastrar produto",
        description: "Ocorreu um erro ao tentar adicionar o produto.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex-1">
      {/* <Header /> */}
      <main className="p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <PackagePlus className="h-6 w-6" />
            <h1 className="text-2xl font-bold text-gray-800">Cadastro de Produtos</h1>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite a descrição do produto"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="celulares">Celulares</SelectItem>
                          <SelectItem value="capas">Capas de Celulares</SelectItem>
                          <SelectItem value="carregadores">Carregadores</SelectItem>
                          <SelectItem value="fones">Fones de Ouvido</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o fornecedor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buy_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Compra</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  <FormField
                  control={form.control}
                  name="sale_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Venda</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          placeholder="Digite a quantidade"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Cadastrar Produto
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductEntry;
