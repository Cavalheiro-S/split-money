"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Cog, FolderOpen, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const configSections = [
    {
      title: "Preferências",
      description: "Configure suas preferências e informações financeiras",
      icon: Cog,
      url: "/preferences",
      color: "text-blue-500",
    },
    {
      title: "Categorias",
      description: "Gerencie as categorias das suas transações",
      icon: FolderOpen,
      url: "/categories",
      color: "text-orange-500",
    },
    {
      title: "Tags",
      description: "Organize suas transações com tags personalizadas",
      icon: Tag,
      url: "/tags",
      color: "text-green-500",
    },
    {
      title: "Status de Pagamento",
      description: "Configure os status de pagamento disponíveis",
      icon: CircleDollarSign,
      url: "/payment-status",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10 bg-gray-100 py-10">
      <div className="flex flex-col gap-10 w-full bg-white p-5 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Cog className="w-10 h-10" />
          <div className="flex flex-col">
            <h3 className="font-semibold">Configurações</h3>
            <span className="text-sm text-muted-foreground">
              Gerencie as configurações do seu perfil e da aplicação
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configSections.map((section) => (
            <Card key={section.url} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(section.url)}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <section.icon className={`w-8 h-8 ${section.color}`} />
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {section.description}
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
          <h4 className="font-semibold mb-2">Sobre as Configurações</h4>
          <p className="text-sm text-muted-foreground">
            Utilize as seções acima para personalizar sua experiência no Split Money. 
            Você pode criar e gerenciar categorias, tags e status de pagamento para 
            organizar melhor suas transações financeiras.
          </p>
        </div>
      </div>
    </div>
  );
}
