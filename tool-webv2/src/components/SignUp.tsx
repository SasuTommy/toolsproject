import { Button, Card, Form, Input, notification } from "antd"
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks"
import { confirm, logout, selecSentCodeEmail, signup } from "../store/slices/authSlice"
import { AuthScreenOptions, setAuthScreenOption } from "../store/slices/menuSlice"

export const SignUp = () => {
    const dispatch = useAppDispatch()
    const sentCodeEmail = useAppSelector(selecSentCodeEmail)
    const [api, contextHolder] = notification.useNotification();

    const registrate = (data: any) => {
        dispatch(signup({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
        })).then((data) => {
            if (data.type.includes('/rejected')) {
                api.error({
                    message: 'Podane dane są niepoprwne',
                    description: 'Sprawdź, czy nie korzystasz z juz zarejestrowanego adresu email',
                    placement: 'topRight',
                    duration: 2.5,
                })
            }
        })
    }

    const confirmAccount = (data: any) => {
        dispatch(confirm({
            email: sentCodeEmail!,
            token: data.code,
        })).then((data) => {
            if (data.type.includes('/rejected')) {
                api.error({
                    message: 'Niepoprawny kod lub adres email',
                    description: 'Sprawdź dane i spróbuj ponownie',
                    placement: 'topRight',
                    duration: 1.5,
                })
            }
            if (data.type.includes('/fulfilled')) {
                dispatch(setAuthScreenOption({ option: AuthScreenOptions.signin }))
            }
        })
    }

    return (
        <Card headStyle={{ textAlign: 'center' }} title="Potwiedz email" style={{ width: '80%' }}>
            {contextHolder}
            {sentCodeEmail !== undefined ? <>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 4 }}
                    initialValues={{ remember: true }}
                    onFinish={confirmAccount}
                    onFinishFailed={() => { }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Wprowadź kod"
                        name="code"
                        rules={[{ required: true, message: 'Kod jest wymagany' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Potwierdz
                        </Button>
                        <Button style={{ marginLeft: 16 }} type="default" onClick={() => dispatch(logout())}>
                            Wróć do wypełnienia danych
                        </Button>
                    </Form.Item>
                </Form>
            </> :
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={registrate}
                    onFinishFailed={() => { }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Email jest wymagany' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Imię"
                        name="firstName"
                        rules={[{ required: true, message: 'Imię jest wymagane' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Nazwisko"
                        name="lastName"
                        rules={[{ required: true, message: 'Nazwisko jest wymagane' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Hasło"
                        name="password"
                        rules={[{ required: true, message: 'Hasło jest wymagane' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Zarejestruj
                        </Button>
                    </Form.Item>
                </Form>
            }
        </Card>
    )
}