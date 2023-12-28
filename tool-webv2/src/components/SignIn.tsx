import { Button, Card, Checkbox, Form, Input, notification } from "antd"
import { useAppDispatch } from "../hooks/storeHooks"
import { login } from "../store/slices/authSlice"
import { loadMe } from "../store/slices/meSlice";

export const SignIn = () => {
    const [api, contextHolder] = notification.useNotification();

    const dispatch = useAppDispatch()

    const onFinish = (data: any) => {
        dispatch(login({ email: data.email, password: data.password, keepInStore: data.remember })).then((data) => {
            if (data.type.includes('/rejected')) {
                api.error({
                    message: 'Nieprawidłowe hasło lub email',
                    description: 'Spróbuj ponownie',
                    placement: 'topRight',
                    duration: 1.5,
                })
            }
            dispatch(loadMe())
        })
    }

    return (
        <Card headStyle={{ textAlign: 'center' }} title="Zaloguj się" style={{ width: '80%' }}>
            {contextHolder}
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
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
                    label="Hasło"
                    name="password"
                    rules={[{ required: true, message: 'Hasło jest wymagane' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 16 }}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Zaloguj
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
