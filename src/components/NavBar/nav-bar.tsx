"use client";

import { HomeOutlined, LogoutOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { routes } from 'global.config';
import { useVerifTokenValid } from 'hooks/use-verif-token-valid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';


export const NavBar = () => {
    const [current, setCurrent] = useState('dashboard');
    const router = useRouter()
    const valid = useVerifTokenValid();

    const itemsUrls = useMemo(() => ({
        dashboard: routes.dashboard,
        transaction: routes.transaction,
        signout: routes.logout
    }), [])

    useEffect(() => {
        const path = router.pathname
        const itemsKeysValues = Object.entries(itemsUrls)
        const itemKey = itemsKeysValues.find(([, value]) => path.includes(value))
        if (itemKey) {
            const [key,] = itemKey
            setCurrent(key)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.pathname])

    const items: MenuProps['items'] = useMemo(() => [
        {
            label: <Link href={itemsUrls.dashboard}>Visão Geral</Link>,
            key: 'dashboard',
            icon: <HomeOutlined />,
        },
        {
            label: (<Link href={itemsUrls.transaction}>Transações</Link>),
            key: 'transaction',
            icon: <PlusCircleOutlined />,
        },
        {
            label: (<Link href={itemsUrls.signout}>Sair</Link>),
            key: 'signout',
            icon: <LogoutOutlined />,
        },
    ], [itemsUrls])

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const renderMenu = useMemo(() => {
        if (valid)
            return <Menu
                className='top-0 left-0 w-48 h-full col-start-1 row-span-3 row-start-2 mt-0.5 border-2 border-green-500 rounded-lg'
                onClick={onClick}
                selectedKeys={[current]}
                mode="vertical"
                items={items} />
        else
            return null
    }, [valid, items, current])

    return renderMenu
}
