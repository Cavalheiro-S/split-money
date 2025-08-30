"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Cog, Home, LogOut, PlusCircle, User } from "lucide-react";
import { LoadingLink } from "@/components/loading-link";
import { useNavigationLoadingContext } from "@/contexts/navigation-loading-context";
import { useUser } from "@/contexts/user-context";
import { useLogoutConfirmation } from "@/hooks/use-logout-confirmation";


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
            <Sidebar>
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