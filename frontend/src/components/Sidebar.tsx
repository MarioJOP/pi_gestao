import { Link } from "react-router-dom";
import {
  Cloud,
  Grid,
  ShoppingCart,
  FileText,
  PlusSquare,
  MinusSquare,
  FileCheck,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { icon: <Cloud className="w-5 h-5" />, label: "Estoque", path: "/estoque" },
    { icon: <Grid className="w-5 h-5" />, label: "Dashboards", path: "/dashboards" },
    { icon: <ShoppingCart className="w-5 h-5" />, label: "Vendas", path: "/vendas" },
    { icon: <FileText className="w-5 h-5" />, label: "Cadastros", path: "/product-entry" },
    { icon: <PlusSquare className="w-5 h-5" />, label: "Entradas", path: "/entradas" },
    { icon: <FileCheck className="w-5 h-5" />, label: "Relatórios", path: "/relatorios" },
  ];

  return (
    <div className="bg-sidebar w-64 min-h-screen p-4 text-white">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Sistema</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;