"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Get order data from sessionStorage
    const orderData = sessionStorage.getItem('orderData');
    if (orderData) {
      setOrder(JSON.parse(orderData));
      // Clean up - remove from sessionStorage after use
      sessionStorage.removeItem('orderData');
    }
  }, []);

  if (!order) {
    return <div>No order information found</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-base font-medium text-[#303efa]">Thank you!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">It's on the way!</p>
          <p className="mt-2 text-base text-gray-500">Your order has been confirmed and will be with you soon.</p>
        </div>

        <div className="mt-10 border-t border-gray-200">
          <h2 className="sr-only">Your order</h2>

          <h3 className="sr-only">Items</h3>
          {order.items.map((item, index) => (
            <div key={item.cartItemKey || index} className="flex space-x-6 border-b border-gray-200 py-10">
              <Image
                alt={item.imageAlt}
                src={item.imageSrc}
                width={160}
                height={160}
                className="size-20 flex-none rounded-lg bg-gray-100 object-cover sm:size-40"
              />
              <div className="flex flex-auto flex-col">
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {item.color?.name} / {item.size?.name}
                  </p>
                </div>
                <div className="mt-6 flex flex-1 items-end">
                  <dl className="flex divide-x divide-gray-200 text-sm">
                    <div className="flex pr-4 sm:pr-6">
                      <dt className="font-medium text-gray-900">Quantity</dt>
                      <dd className="ml-2 text-gray-700">{item.quantity}</dd>
                    </div>
                    <div className="flex pl-4 sm:pl-6">
                      <dt className="font-medium text-gray-900">Price</dt>
                      <dd className="ml-2 text-gray-700">£{item.total.toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ))}

          <div className="sm:ml-40 sm:pl-6">
            <h3 className="sr-only">Your information</h3>

            <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Shipping address</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">{order.customerInfo.first_name} {order.customerInfo.last_name}</span>
                    <span className="block">{order.customerInfo.firstLine_address}</span>
                    <span className="block">{order.customerInfo.city}</span>
                    <span className="block">{order.customerInfo.post_code}</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Delivery method</dt>
                <dd className="mt-2 text-gray-700">
                  <p>{order.delivery.method?.title}</p>
                  <p>{order.delivery.subOption?.title}</p>
                  {order.delivery.date && (
                    <p>Delivery Date: {new Date(order.delivery.date.date).toLocaleDateString()}</p>
                  )}
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">Summary</h3>

            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Subtotal</dt>
                <dd className="text-gray-700">£{order.totals.subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Shipping</dt>
                <dd className="text-gray-700">£{order.totals.shipping.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">VAT</dt>
                <dd className="text-gray-700">£{order.totals.vat.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Total</dt>
                <dd className="text-gray-900">£{order.totals.total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}