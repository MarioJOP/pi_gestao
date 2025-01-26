import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Reports = () => {
  const { toast } = useToast();

  const handleExportCSV = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/reports/csv/");
      if (!response.ok) {
        throw new Error("Erro ao gerar o relatório CSV");
      }

      // Criando o link de download
      const blob = await response.blob();
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "products_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Relatório exportado com sucesso!",
        description: "O arquivo CSV foi baixado para o seu computador.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório CSV.",
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/reports/pdf/");
      if (!response.ok) {
        throw new Error("Erro ao gerar o relatório PDF");
      }

      // Criando o link de download
      const blob = await response.blob();
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "products_report.pdf");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Relatório exportado com sucesso!",
        description: "O arquivo PDF foi baixado para o seu computador.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório PDF.",
      });
    }
  };

  return (
    <div className="flex-1">
       {/* <Header /> */}
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <div className="flex gap-4">
            <Button onClick={handleExportCSV} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar para CSV
            </Button>
            <Button onClick={handleExportPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar para PDF
            </Button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            Use os botões acima para exportar os dados do sistema em formato CSV ou PDF.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
