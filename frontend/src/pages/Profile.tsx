import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch do perfil do usuário ao carregar a página
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/profile/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
        setError("Erro ao carregar o perfil. Redirecionando para o login...");
        router.push("/login"); // Redireciona se não autenticado
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Função de logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/logout/`,
        {
          refresh: localStorage.getItem("refresh_token"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setError("Erro ao fazer logout.");
    }
  };

  // Exibe um carregamento enquanto o usuário não é carregado
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Carregando...</p>
      </div>
    );
  }

  // Exibe uma mensagem de erro, se houver
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Perfil do Usuário</h1>
          {user && (
            <div className="flex flex-col items-center space-y-4">
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;