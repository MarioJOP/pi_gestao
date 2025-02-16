import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MetricCard from "@/components/MetricCard";
import ShortcutCard from "@/components/ShortcutCard";
import { FileText, MinusSquare, PlusSquare, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate(); // Usando o hook useNavigate para redirecionamento
  
    // Função para verificar se o usuário está logado
    const isUserLoggedIn = () => {
      const token = localStorage.getItem("access_token");
      return token !== null && token !== undefined;
    };
  
    // Redirecionar para a página de login se o usuário não estiver logado
    useEffect(() => {
      if (!isUserLoggedIn()) {
        navigate("/login"); // Substitua "/login" pelo caminho correto da sua página de login
      }
    }, [navigate]);


  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Header showSearchBar={false} />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <MetricCard title="Produtos mais vendidos" />
              <MetricCard title="Quantidade de produtos em estoque" />
              <MetricCard title="Custo total de produtos" />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-6">Atalhos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ShortcutCard
                icon={FileText}
                category="Cadastros"
                title="Cadastro de produtos"
                subtitle="Adicionar novos produtos"
                
              />
              <ShortcutCard
                icon={ClipboardCheck}
                category="Relatórios"
                title="Encomendas"
                subtitle="Visualizar encomendas"
              />
              <ShortcutCard
                icon={MinusSquare}
                category="Saídas"
                title="Despesas"
                subtitle="Registrar despesas"
              />
              <ShortcutCard
                icon={PlusSquare}
                category="Entradas"
                title="Assistência Técnica"
                subtitle="Registrar assistência"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;