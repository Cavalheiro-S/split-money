import { HomeOutlined, LogoutOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

type NavBarProps = {
    isAuthenticated: boolean
}

export const NavBar = ({ isAuthenticated }: NavBarProps) => {
    const router = useRouter()
    const [current, setCurrent] = useState('dashboard');

    const items: MenuProps['items'] = [
        {
            label: (<span>Visão Geral</span>),
            key: 'dashboard',
            icon: <HomeOutlined />,
            disabled: !isAuthenticated,
            onClick: () => { router.push("/dashboard") }
        },
        {
            label: (<span>Transações</span>),
            key: 'transaction',
            icon: <PlusCircleOutlined />,
            disabled: !isAuthenticated,
            onClick: () => { router.push("/transaction") }
        },
        {
            label: (<span>Sair</span>),
            key: 'signout',
            icon: <LogoutOutlined />,
            disabled: !isAuthenticated,
            onClick: () => { router.push("/session/logout") }
        },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return (
        isAuthenticated
            ? <Menu
                className='top-0 left-0 w-48 h-full col-start-1 row-span-2 border-2 border-green-500'
                onClick={onClick}
                selectedKeys={[current]}
                mode="vertical"
                items={items} />
            : null
    )
}
