import { Content } from "antd/es/layout/layout"
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks"
import { loadList, removeSelectedItem, selectCatalog, selectSelectedCatalogItem, setSelectedItem } from "../store/slices/toolsCatalogSlice"
import { useEffect } from "react"
import { Button, Card, Modal, Space, notification } from "antd"
import { ToolsItem } from "../components/ToolsItem"
import Meta from "antd/es/card/Meta"
import { selectAuthState } from "../store/slices/authSlice"
import { addToCart } from "../store/slices/cartSlice"

export const ToolsList = () => {
    const dispatch = useAppDispatch()
    const catalogList = useAppSelector(selectCatalog)
    const selectedItem = useAppSelector(selectSelectedCatalogItem)
    const authState = useAppSelector(selectAuthState)
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        dispatch(loadList())
    }, [])

    return (
        <Content style={{ margin: '24px 16px 0', height: '100%' }}>
            {contextHolder}
            <Space style={{ display: 'flex', flexWrap: 'wrap' }} size={'large'}>
                {catalogList.map((tool: any) =>
                    <ToolsItem item={tool} key={tool.id} onClick={() => {
                        dispatch(setSelectedItem({ id: tool.id }))
                    }} />)}
            </Space>
            <Modal
                open={selectedItem !== undefined}
                onCancel={() => {
                    dispatch(removeSelectedItem())
                }}
                footer={[
                    authState.accessToken !== undefined ?
                        <Button onClick={() => {
                            if (selectedItem!.available > 0) {
                                dispatch(addToCart({ item: selectedItem! }))
                                dispatch(removeSelectedItem())
                            } else {
                                api.error({
                                    message: `Niedostępne`,
                                    description: 'Nie zostało dostępnych na magazynie',
                                    placement: 'topRight',
                                });
                            }
                        }} key="submit" type="primary">
                            Dodaj do koszyka
                        </Button> : <p>Zaloguj się lub załóz konto, aby zarezerwować</p>,
                ]}
            >
                {selectedItem !== undefined ?
                    <Card
                        style={{ width: '100%' }}
                        cover={<img src={selectedItem.image_url} />}
                    >
                        <Meta title={selectedItem.label} description={`Dostępne: ${selectedItem.available}`} />
                        <Meta description={`Za dobę: ${selectedItem.price} zł`} />
                        <Meta description={selectedItem.description} />
                    </Card>
                    : <></>}
            </Modal>
        </Content>
    )
} 