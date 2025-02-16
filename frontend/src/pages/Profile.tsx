import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para renovar o token caso esteja expirado
  const refreshAuthToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/refresh/`,
        { refresh: localStorage.getItem("refresh_token") }
      );
      localStorage.setItem("access_token", response.data.access);
      console.log("teste", response.data.access)
      return response.data.access;
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      console.log("access no refresh:", localStorage.getItem("access_token"))
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
      return null;
    }
  };

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async (signal, retryCount = 0) => {
    try {
      const token = localStorage.getItem("access_token");
      console.log("Access token no localStorage:", localStorage.getItem("access_token"));

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });

      setUser(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401 && retryCount < 3) {
        const newToken = await refreshAuthToken();
        if (newToken) {
          return fetchUserProfile(signal, retryCount + 1); // Rechama com o novo token
        } else {
          navigate("/login"); // Redireciona para login se não conseguir renovar o token
        }
      } else {
        console.error("Erro ao carregar perfil:", error);
        setError("Erro ao carregar o perfil. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar o perfil ao montar a página
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchUserProfile(signal);

    return () => {
      controller.abort();
    };
  }, []);

  // Função para logout
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout/`,
        { refresh: localStorage.getItem("refresh_token") },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setError("Erro ao fazer logout.");
    } finally {
      console.log("token no logout", localStorage.getItem("access_token"));
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      console.log("token no logout2", localStorage.getItem("access_token"));
      setUser(null);
      navigate("/login");
    }
  };

  // Renderização condicional
  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Perfil do Usuário</h1>
          {user?.username && (
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