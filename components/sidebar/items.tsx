"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Cog, Home, LogOut, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


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
    const router = useRouter()
    const itemsProfile: SidebarItem[] = [
        {
            title: "Configurações",
            url: "/profile",
            Icon: Cog,
        },
        {
            title: "Sair",
            url: "/sign-in",
            Icon: LogOut,
            onClick: async () => {
                await fetch("/api/auth/sign-out")
                router.replace("/sign-in")
            },
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
                    <Link href={url}>
                        <Icon />
                        <span>{title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
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
    )
}