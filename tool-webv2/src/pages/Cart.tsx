import { Button, Card, DatePicker, Layout, List, notification } from "antd"
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks"
import { bookItems, changeDates, removeFromCart, selectCartItems, selectDates, selectDatesDiff, selectSum } from "../store/slices/cartSlice"
import dayjs from "dayjs"

export const Cart = () => {
    const dispatch = useAppDispatch()
    const cartItems = useAppSelector(selectCartItems)
    const [api, contextHolder] = notification.useNotification();
    const dates = useAppSelector(selectDates)
    const datesDiff = useAppSelector(selectDatesDiff)
    const sum = useAppSelector(selectSum)

    const disabledDate: any = (current: any) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };
    
    const onDatesChange = (dates: any) => {
        if (dates !== null && dates !== undefined && dates.length > 1) {
            dispatch(changeDates({ range: [dates[0].format('YYYY-MM-DD'), dates[1]?.format('YYYY-MM-DD')] }))
        }
    }

    const finish = () => {
        dispatch(bookItems({
            items: cartItems,
            dateStart: dates.dateStart,
            dateEnd: dates.dateEnd,
        })).then((data) => {
            if (data.type.includes('/rejected')) {
                api.error({
                    message: `Ups!`,
                    description: 'Coś poszło nie tak',
                    placement: 'topRight',
                });
            }
        })
    }

    const { RangePicker } = DatePicker;

    return (
        <Layout style={{ width: '100%' }}>
            {contextHolder}
            <RangePicker
                disabledDate={disabledDate}
                value={[dayjs(dates.dateStart), dayjs(dates.dateEnd)]}
                style={{ margin: '4px 10%' }}
                onChange={(dates, _) => onDatesChange(dates)} />
            <List
                itemLayout="vertical"
                size="large"
                dataSource={cartItems}
                renderItem={(item: any) => (
                    <List.Item
                        key={item.title}
                        extra={
                            <img
                                width={128}
                                alt="logo"
                                src={item.image_url}
                            />
                        }
                    >
                        <List.Item.Meta
                            title={item.label}
                            description={item.description}
                        />
                        <p>Za dobę: {item.price} zł</p>
                        <Button onClick={() => {
                            dispatch(removeFromCart({ id: item.id }))
                        }} danger>Usuń</Button>
                    </List.Item>
                )}
            />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card headStyle={{ textAlign: 'center' }} title="Podsumowanie" bordered={false} style={{ width: 300 }}>
                    <div>Ilość dni: {datesDiff !== 0 ? datesDiff : 1}</div>
                    <div>Należność: {sum}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '16px' }}>
                        <Button onClick={finish} type="primary">
                            Rezerwuj
                        </Button>
                    </div>
                </Card>
            </div>

        </Layout>
    )
}