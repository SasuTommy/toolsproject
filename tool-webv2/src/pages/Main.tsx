import { Layout, Menu } from "antd"
import Sider from "antd/es/layout/Sider";
import { ShoppingFilled, UserOutlined, ToolFilled, WalletFilled } from '@ant-design/icons';
import React, { useEffect } from "react";
import { Footer, Header } from "antd/es/layout/layout";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import { selectAuthState } from "../store/slices/authSlice";
import { selectMenuActiveItem, setActiveItem } from "../store/slices/menuSlice";
import { Account } from "./Account";
import { ToolsList } from "./ToolsList";
import { Cart } from "./Cart";
import { Bookings } from "./Bookings";
import { loadMe, selectIsAdmin } from "../store/slices/meSlice";

export const Main = () => {
    const dispatch = useAppDispatch()
    const authState = useAppSelector(selectAuthState)
    const activeNavItem = useAppSelector(selectMenuActiveItem)
    const isAdmin = useAppSelector(selectIsAdmin)

    useEffect(() => {
        if (authState.accessToken) {
            dispatch(loadMe())
        }
    })

    const changeNavItem = (newNavItem: any) => {
        dispatch(setActiveItem({ newItem: parseInt(newNavItem.key) }))
    }

    const NAV_ITEMS = [
        {
            icon: UserOutlined,
            label: 'Konto',
            item: <Account />,
            authOnly: false,
        },
        {
            icon: ToolFilled,
            label: 'Lista sprzętu',
            item: <ToolsList />,
            authOnly: false,
        },
        {
            icon: ShoppingFilled,
            label: 'Koszyk',
            item: <Cart />,
            authOnly: true,
        },
        {
            icon: WalletFilled,
            label: 'Zarezerwowane',
            item: <Bookings />,
            authOnly: true,
        },
    ]
    return (
        <Layout style={{ width: '100%', minHeight: '100vh' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div style={{
                    width: 120,
                    height: 120,
                    color: '#fff',
                    display: 'flex',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>ToolsApp</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={NAV_ITEMS.filter((i) => !i.authOnly || authState.accessToken !== undefined).map((navItem, index) => {
                        if (index === 3 && isAdmin) {
                            return {
                                key: `${index}`,
                                icon: React.createElement(navItem.icon),
                                label: 'Pokaż raport',
                            }
                        }
                        return {
                            key: `${index}`,
                            icon: React.createElement(navItem.icon),
                            label: navItem.label,
                        }
                    })}
                    onSelect={changeNavItem}
                    selectedKeys={[`${activeNavItem}`]}
                />
            </Sider>

            <Layout>
                <Header style={{ padding: 0 }} />
                {NAV_ITEMS[activeNavItem].item ?? <div>hello</div>}
                <Footer style={{ textAlign: 'center' }}>Created by Tomasz Sas ©2023 </Footer>
            </Layout>

        </Layout>
    )
}
