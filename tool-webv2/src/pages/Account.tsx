import { Button, Card, Space } from "antd"
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks"
import { logout, selectAuthState } from "../store/slices/authSlice"
import { Auth } from "./Auth"
import { useEffect } from "react"
import { clearMeInfo, loadMe, selectMeInfo } from "../store/slices/meSlice"
import { Content } from "antd/es/layout/layout"

export const Account = () => {
    const authState = useAppSelector(selectAuthState)
    const me = useAppSelector(selectMeInfo)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (authState.accessToken !== undefined) {
            dispatch(loadMe())
        } else {
            dispatch(clearMeInfo())
        }
    }, [authState.accessToken])

    if (authState.accessToken !== undefined && me !== undefined) {
        return (
            <Content style={{ margin: '24px 16px 0', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card headStyle={{ textAlign: 'center' }} title="Konto" style={{ width: '80%' }}>
                    <Space size='small' style={{ display: 'flex', flexDirection: 'column', justifyItems: 'start', alignItems: 'start' }}>
                        <div>Imię: {me.first_name}</div>
                        <div>Nazwisko: {me.last_name}</div>
                        <div>Email: {me.email}</div>
                        <Button onClick={() => {
                            dispatch(logout())
                        }} type="primary" size={'middle'} danger >
                            Wyloguj
                        </Button>
                    </Space>
                </Card>
            </Content>
        )
    }

    return <Auth />
}