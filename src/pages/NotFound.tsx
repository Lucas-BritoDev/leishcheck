import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SearchX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="gradient-bg flex min-h-screen items-center justify-center px-6">
      <div className="glass-card flex flex-col items-center gap-6 p-10 text-center max-w-sm">
        <div className="icon-circle h-20 w-20">
          <SearchX className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl font-bold text-gradient">404</h1>
        <p className="text-lg text-muted-foreground">Página não encontrada</p>
        <a href="/" className="gradient-btn inline-block rounded-2xl px-8 py-3 text-base font-semibold no-underline">
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
