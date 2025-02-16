import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importando o plugin
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";

// Registrando os componentes necessários para o gráfico
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Registrando o plugin
);

const Dashboards = () => {
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


  const [expandedChart, setExpandedChart] = useState(null); // Estado para controlar qual gráfico está expandido

  // Dados de exemplo para os gráficos
  const dataVendasMes = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    datasets: [
      {
        label: 'Vendas por Mês',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const dataVendasFuncionario = {
    labels: ['João', 'Maria', 'José', 'Ana', 'Carlos'],
    datasets: [
      {
        label: 'Vendas por Funcionário',
        data: [5, 7, 3, 8, 6],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Gráfico de Entradas e Saídas por Valores (gráfico de linhas)
  const dataEntradasSaidasEstoqueValores = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    datasets: [
      {
        label: 'Custo',
        data: [5000, 8000, 4500, 6000, 7000],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
      {
        label: 'Lucro Bruto',
        data: [7000, 10000, 6500, 8000, 9500],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Gráfico de Entradas e Saídas por Quantitativo (gráfico de barras lado a lado)
  const dataEntradasSaidasEstoqueQuantitativo = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    datasets: [
      {
        label: 'Entradas no Estoque',
        data: [50, 70, 65, 60, 90],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Saídas no Estoque',
        data: [30, 50, 40, 45, 60],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Gráfico Ranque dos Produtos Mais Vendidos
  const dataRanqueProdutos = {
    labels: ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Produto E'],
    datasets: [
      {
        label: 'Produtos Mais Vendidos',
        data: [120, 150, 180, 90, 200],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Gráfico de Lucro Líquido
  const dataLucroLiquido = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    datasets: [
      {
        label: 'Lucro Líquido',
        data: [2000, 4000, 3500, 3000, 4500],
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
      },
    ],
  };

  // Função para abrir o gráfico expandido
  const handleChartClick = (chartName) => {
    setExpandedChart(chartName);
  };

  // Função para fechar o gráfico expandido
  const closeExpandedChart = () => {
    setExpandedChart(null);
  };

  return (
    <div className="flex-1">
      <Header showSearchBar={false} />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboards</h1>

        {/* Primeira linha - Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Card Produto com maior número de vendas */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-lg font-semibold">Produto com maior número de vendas</h2>
            <p className="mt-2 text-xl">Produto XYZ</p>
          </div>

          {/* Card Produto com maior rentabilidade */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-lg font-semibold">Produto com maior rentabilidade</h2>
            <p className="mt-2 text-xl">Produto ABC</p>
          </div>

          {/* Card Quantidade de produtos no estoque */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-lg font-semibold">Quantidade de produtos no estoque</h2>
            <p className="mt-2 text-xl">200</p>
          </div>

          {/* Card Lucro/Prejuízo */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-lg font-semibold">Lucro/Prejuízo</h2>
            <p className="mt-2 text-xl">R$ 12.000,00</p>
          </div>

          {/* Card Data/Hora */}
          <div className="bg-white p-6 shadow rounded">
            <h2 className="text-lg font-semibold">Data/Hora</h2>
            <p className="mt-2 text-xl">{new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Barra de separação */}
        <div className="border-b-2 border-gray-200 mb-8"></div>

        {/* Segunda linha - Gráficos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gráfico Vendas por Mês */}
          <div
            className="bg-white p-6 shadow rounded transition-transform duration-300 transform hover:scale-105"
            onClick={() => handleChartClick('vendasMes')}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Vendas por Mês</h3>
            <Bar
              data={dataVendasMes}
              options={{
                plugins: {
                  datalabels: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.7)', // Cor do texto do rótulo
                    font: {
                      weight: 'bold',
                      size: 10,
                    },
                    align: 'center', // Alinha o valor no centro da barra
                    anchor: 'center', // Coloca o rótulo no meio da barra
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${tooltipItem.raw} vendas`, // Exibir valores
                    },
                  },
                },
              }}
            />
          </div>

          {/* Gráfico Vendas por Funcionário (horizontal) */}
          <div
            className="bg-white p-6 shadow rounded transition-transform duration-300 transform hover:scale-105"
            onClick={() => handleChartClick('vendasFuncionario')}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Vendas por Funcionário</h3>
            <Bar
              data={dataVendasFuncionario}
              options={{
                indexAxis: 'y',
                plugins: {
                  datalabels: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.7)',
                    font: {
                      weight: 'bold',
                      size: 10,
                    },
                    align: 'end',
                    anchor: 'end',
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${tooltipItem.raw} vendas`, // Exibir valores
                    },
                  },
                },
              }}
            />
          </div>

          {/* Gráfico Entradas e Saídas no Estoque (Valores) */}
          <div
            className="bg-white p-6 shadow rounded transition-transform duration-300 transform hover:scale-105"
            onClick={() => handleChartClick('entradasSaidasValores')}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Entradas e Saídas no Estoque (Valores)</h3>
            <Line
              data={dataEntradasSaidasEstoqueValores}
              options={{
                plugins: {
                  datalabels: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.7)',
                    font: {
                      weight: 'bold',
                      size: 10,
                    },
                    align: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `R$ ${tooltipItem.raw}`, // Exibir valores em R$
                    },
                  },
                },
              }}
            />
          </div>

          {/* Gráfico Entradas e Saídas no Estoque (Quantitativo) */}
          <div
            className="bg-white p-6 shadow rounded transition-transform duration-300 transform hover:scale-105"
            onClick={() => handleChartClick('entradasSaidasQuantitativo')}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Entradas e Saídas no Estoque (Quantitativo)</h3>
            <Bar
              data={dataEntradasSaidasEstoqueQuantitativo}
              options={{
                plugins: {
                  datalabels: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.7)',
                    font: {
                      weight: 'bold',
                      size: 10,
                    },
                    align: 'center',
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${tooltipItem.raw} unidades`, // Exibir valores quantitativos
                    },
                  },
                },
              }}
            />
          </div>

          {/* Gráfico Ranque dos Produtos Mais Vendidos */}
          <div
            className="bg-white p-6 shadow rounded transition-transform duration-300 transform hover:scale-105"
            onClick={() => handleChartClick('ranqueProdutos')}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Ranque dos Produtos Mais Vendidos</h3>
            <Bar
              data={dataRanqueProdutos}
              options={{
                plugins: {
                  datalabels: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.7)',
                    font: {
                      weight: 'bold',
                      size: 10,
                    },
                    align: 'center',
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${tooltipItem.raw} vendas`, // Exibir valores
                    },
                  },
                },
              }}
            />
          </div>

          {/* Gráfico Lucro Líquido */}
          <div
            className="bg-white p-6 shadow rounded transition-transform duration-300 transform hover:scale-105"
            onClick={() => handleChartClick('lucroLiquido')}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Lucro Líquido</h3>
            <Line
              data={dataLucroLiquido}
              options={{
                plugins: {
                  datalabels: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.7)',
                    font: {
                      weight: 'bold',
                      size: 10,
                    },
                    align: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `R$ ${tooltipItem.raw}`, // Exibir valores em R$
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Modal de Exibição do Gráfico Expandido */}
        {expandedChart && (
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeExpandedChart}
          >
            <div
              className="bg-white p-6 shadow rounded max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()} // Impede que o clique no modal feche-o
            >
              <h3 className="text-lg font-semibold mb-4">
                {expandedChart === 'vendasMes' && 'Vendas por Mês'}
                {expandedChart === 'vendasFuncionario' && 'Vendas por Funcionário'}
                {expandedChart === 'entradasSaidasValores' && 'Entradas e Saídas no Estoque (Valores)'}
                {expandedChart === 'entradasSaidasQuantitativo' && 'Entradas e Saídas no Estoque (Quantitativo)'}
                {expandedChart === 'ranqueProdutos' && 'Ranque dos Produtos Mais Vendidos'}
                {expandedChart === 'lucroLiquido' && 'Lucro Líquido'}
              </h3>
              {expandedChart === 'vendasMes' && <Bar data={dataVendasMes} />}
              {expandedChart === 'vendasFuncionario' && <Bar data={dataVendasFuncionario} options={{ indexAxis: 'y' }} />}
              {expandedChart === 'entradasSaidasValores' && <Line data={dataEntradasSaidasEstoqueValores} />}
              {expandedChart === 'entradasSaidasQuantitativo' && <Bar data={dataEntradasSaidasEstoqueQuantitativo} />}
              {expandedChart === 'ranqueProdutos' && <Bar data={dataRanqueProdutos} />}
              {expandedChart === 'lucroLiquido' && <Line data={dataLucroLiquido} />}
              <button
                className="mt-4 bg-red-500 text-white p-2 rounded"
                onClick={closeExpandedChart}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboards;