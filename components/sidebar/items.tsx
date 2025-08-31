"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Cog, Home, LogOut, PlusCircle, User, X, Wallet } from "lucide-react";
import { LoadingLink } from "@/components/loading-link";
import { useNavigationLoadingContext } from "@/contexts/navigation-loading-context";
import { useUser } from "@/contexts/user-context";
import { useLogoutConfirmation } from "@/hooks/use-logout-confirmation";
import { cn } from "@/lib/utils";


type SidebarItem = {
    title: string;
    url: string;
    Icon: React.ComponentType;
    onClick?: () => void;
}

const itemsApplication: SidebarItem[] = [
    {
        title: "Visão Geral",
        url: "/dashboard",
        Icon: Home,
    },
    {
        title: "Transações",
        url: "/transactions",
        Icon: PlusCircle,
    },
]

export const SidebarItems = () => {
    const { startLoading } = useNavigationLoadingContext()
    const { logout } = useUser()
    const { ConfirmationDialog, confirmLogout } = useLogoutConfirmation()
    const { isMobile, setOpenMobile, state } = useSidebar()
    
    const handleLogout = async () => {
        const confirmed = await confirmLogout()
        if (confirmed) {
            startLoading()
            logout()
        }
    }
    
    const itemsProfile: SidebarItem[] = [
        {
            title: "Perfil",
            url: "/profile",
            Icon: User,
        },
        {
            title: "Configurações",
            url: "/config",
            Icon: Cog,
        },
        {
            title: "Sair",
            url: "/sign-in",
            Icon: LogOut,
            onClick: handleLogout,
        },
    ]

    const renderNavItem = ({ onClick, Icon, title, url }: SidebarItem) => {

        if (onClick) {
            return (
                <SidebarMenuItem key={title}>
                    <SidebarMenuButton onClick={onClick}>
                        <Icon />
                        <span>{title}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )
        }

        return (
            <SidebarMenuItem key={title}>
                <SidebarMenuButton asChild>
                    <LoadingLink href={url}>
                        <Icon />
                        <span>{title}</span>
                    </LoadingLink>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <div className={cn("flex items-center gap-2 px-4 py-2", state === "collapsed" && "px-0")}>
                        {/* Logo com tooltip quando colapsada */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 px-2">
                                        <Wallet className="h-5 w-5" />
                                    </div>
                                </TooltipTrigger>
                                {state === "collapsed" && (
                                    <TooltipContent side="right" className="font-semibold">
                                        Split Money
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                        
                        {/* Texto que aparece apenas quando expandida */}
                        <div className={`grid flex-1 text-left text-sm leading-tight transition-all duration-300 overflow-hidden ${
                            state === "collapsed" 
                                ? "opacity-0 scale-90 pointer-events-none translate-x-[-10px] w-0" 
                                : "opacity-100 scale-100 translate-x-0 w-auto"
                        }`}>
                            <span className="truncate font-semibold text-sidebar-foreground">Split Money</span>
                            <span className="truncate text-xs text-muted-foreground">Controle de Gastos</span>
                        </div>
                        
                        {/* Botão de fechar apenas no mobile */}
                        {isMobile && (
                            <button
                                onClick={() => setOpenMobile(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
                                aria-label="Fechar menu"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {itemsApplication.map(renderNavItem)}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Perfil</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {itemsProfile.map(renderNavItem)}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <ConfirmationDialog />
        </>
    )
}