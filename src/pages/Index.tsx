
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(true);

  // If user is logged in, redirect to the tools page
  if (user) {
    return <Navigate to="/verktyg" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Verktygshantering</h1>
        <p className="text-xl text-gray-600 mb-8">Logga in för att fortsätta</p>
        <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      </div>
    </div>
  );
};

export default Index;
