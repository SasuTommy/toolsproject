import { Button, Layout, List, DatePicker } from "antd"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks"
import { BookingItem, deleteBookingItem, loadBookings, loadRaport, selectBookings, updateEndDate } from "../store/slices/bookingsSlice"
import { loadList } from "../store/slices/toolsCatalogSlice"
import dayjs from "dayjs"
import { selectIsAdmin } from "../store/slices/meSlice"

export const Bookings = () => {
    const dispatch = useAppDispatch()
    const items = useAppSelector(selectBookings)
    const isAdmin = useAppSelector(selectIsAdmin)
    const [datePickerId, setDatePickerId] = useState<string | null>(null)
    const [newDate, setNewDate] = useState<any>(null);

    useEffect(() => {
        if (!isAdmin) {
            dispatch(loadBookings())
        }
    }, [items])

    useEffect(() => {
        if (isAdmin) {
            dispatch(loadRaport())
        }
    }, [])

    const cancelBooking = (id: string) => {
        dispatch(deleteBookingItem({ id })).then((_) => {
            dispatch(loadList())
        })
    }

    const updateDateEnd = async (id: string, newDate: dayjs.Dayjs) => {
        setNewDate(null)
        setDatePickerId(null)
        dispatch(updateEndDate({ id, newDate: newDate.format('YYYY-MM-DD') })).then(() => {
            dispatch(loadBookings())
        })
    }

    const getSum = () => {
        let sum = 0;
        items.forEach((i) => {
            sum += i.sumPrice;
        })
        return sum
    }

    const actions = (item: BookingItem): any => {
        if (isAdmin) return []
        const items = []

        const isAvailableToCancel = !item.isVerified || dayjs(item.dateStart).diff(dayjs(), 'days') > 2

        if (isAvailableToCancel) {
            items.push(
                <Button type="primary" onClick={() => cancelBooking(item.id)} danger>
                    Odwołaj rezerwację
                </Button>
            )
        }

        if (datePickerId === item.id) {
            items.push(
                <DatePicker
                    picker={'date'}
                    onChange={(date) => setNewDate(date)}
                    disabledDate={(date) => dayjs(item.dateEnd).isAfter(date)} />
            )
            items.push(
                <Button type="primary" onClick={() => {
                    setDatePickerId(null)
                    setNewDate(null)
                }} danger>
                    Wróć
                </Button>
            )
            if (newDate !== null && newDate !== undefined) {
                items.push(
                    <Button type="primary" onClick={() => updateDateEnd(item.id, newDate)}>
                        Przedłuż
                    </Button>
                )
            }
        } else {
            items.push(
                <Button type="primary" onClick={() => {
                    setDatePickerId(item.id)
                    setNewDate(null)
                }}>
                    Przedłużenie rezerwacji
                </Button>
            )
        }

        return items
    }

    return (
        <Layout style={{ width: '100%' }}>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={items}
                renderItem={(item: any) => (
                    <List.Item
                        key={item.id}
                        actions={actions(item)}
                    >
                        <List.Item.Meta
                            title={`${item.dateStart} - ${item.dateEnd}`}
                            description={`Numer: ${item.id}`}
                        />
                        {isAdmin ? <List.Item.Meta
                            description={`Zamówienie o wartości: ${item.sumPrice} zł`}
                        /> : null}
                        <p>Status: {item.isVerified ? 'Zaakceptowany' : 'Oczekujący'}</p>
                    </List.Item>
                )}
            />
            {isAdmin ? <h4 style={{ marginLeft: 24 }}>Zysk: <span style={{ color: 'green'}}>{ getSum() } zł</span></h4> : null}
        </Layout>
    )
}
