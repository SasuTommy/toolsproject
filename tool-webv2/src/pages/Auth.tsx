import { Radio, RadioChangeEvent } from "antd"
import { Content } from "antd/es/layout/layout"
import { useState } from "react"
import { SignIn } from "../components/SignIn"
import { SignUp } from "../components/SignUp"
import { AuthScreenOptions, selectAuthScreenOption, setAuthScreenOption } from "../store/slices/menuSlice"
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks"

export const Auth = () => {
    const option = useAppSelector(selectAuthScreenOption)
    const dispatch = useAppDispatch()

    const handleModeChange = (e: RadioChangeEvent) => {
        dispatch(setAuthScreenOption({
            option: e.target.value
        }))
    }

    return (
        <Content style={{ margin: '24px 16px 0', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: "flex", justifyContent: 'center' }}>
                <Radio.Group onChange={handleModeChange} value={option} style={{ marginBottom: 8 }}>
                    <Radio.Button value={AuthScreenOptions.signin}>Logowanie</Radio.Button>
                    <Radio.Button value={AuthScreenOptions.signup}>Rejestracja</Radio.Button>
                </Radio.Group>
            </div>
            {option === AuthScreenOptions.signin ? <SignIn /> : <SignUp />}
        </Content>
    )
}