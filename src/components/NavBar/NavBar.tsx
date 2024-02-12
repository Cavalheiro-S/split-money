"use client"
import { HomeOutlined, LogoutOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';


export const NavBar = () => {
    const router = useRouter()
    const [current, setCurrent] = useState('dashboard');

    const items: MenuProps['items'] = [
        {
            label: (<span>Visão Geral</span>),
            key: 'dashboard',
            icon: <HomeOutlined />,
            onClick: () => { router.push("/dashboard") }
        },
        {
            label: (<span>Transações</span>),
            key: 'transaction',
            icon: <PlusCircleOutlined />,
            onClick: () => { router.push("/transaction") }
        },
        {
            label: (<span>Sair</span>),
            key: 'signout',
            icon: <LogoutOutlined />,
            onClick: () => { router.push("/session/logout") }
        },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return (
        <Menu
            className='top-0 left-0 w-48 h-full col-start-1 row-span-3 row-start-2 border-2 border-green-500'
            onClick={onClick}
            selectedKeys={[current]}
            mode="vertical"
            items={items} />
    )
}
