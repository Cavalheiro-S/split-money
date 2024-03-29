"use client";

import { AuthContext } from '@/context/auth-context';
import { HomeOutlined, LogoutOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { useContext, useMemo, useState } from 'react';


export const NavBar = () => {
    const [current, setCurrent] = useState('dashboard');
    const { token } = useContext(AuthContext)
    

    const items: MenuProps['items'] = useMemo(() => [
        {
            label: <Link href={"/dashboard"}>Visão Geral</Link>,
            key: 'dashboard',
            icon: <HomeOutlined />,
        },
        {
            label: (<Link href={"/transaction"}>Transações</Link>),
            key: 'transaction',
            icon: <PlusCircleOutlined />,
        },
        {
            label: (<Link href={"/session/logout"}>Sair</Link>),
            key: 'signout',
            icon: <LogoutOutlined />,
        },
    ], [])

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const renderMenu = useMemo(() => {
        if (token)
            return <Menu
                className='top-0 left-0 w-48 h-full col-start-1 row-span-3 row-start-2 border-2 border-green-500'
                onClick={onClick}
                selectedKeys={[current]}
                mode="vertical"
                items={items} />
        else
            return null
    }, [token, items, current])

    return renderMenu
}
