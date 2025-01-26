import { useState } from "react";
import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = "http://localhost:8000/api/login/ "; // Ajuste para o endpoint correto da sua API
    const payload = { username, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Armazenar o token no localStorage
        localStorage.setItem("token", data.token);
        setMessage("Login realizado com sucesso!");

        // Redirecionar para a página inicial protegida
        navigate("/");
      } else {
        setMessage(data.detail || "Credenciais inválidas. Tente novamente.");
      }
    } catch (error) {
      setMessage("Erro ao conectar ao servidor. Tente novamente.");
      console.error("Erro:", error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md md:max-w-lg p-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <p className="text-center text-sm text-red-500">{message}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                type="button"
                onClick={() => navigate("/register")}
                className="text-sm"
              >
                Não tem uma conta? Cadastre-se
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
