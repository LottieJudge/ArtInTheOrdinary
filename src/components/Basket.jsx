"use client"

import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon, ClockIcon, QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'




  export default function Basket() {
    const { cartItems = [], removeFromCart, updateQuantity } = useCart() || {};
    
    // Fix subtotal calculation
    const subtotal = cartItems?.reduce((total, item) => {
        const price = typeof item.price === 'string' 
            ? parseFloat(item.price.replace('£', '')) 
            : item.price;
        return total + (price * (item?.quantity || 1));
    }, 0) || 0;

    const shipping = 5.95;
    const total = subtotal + shipping;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <li key={index} className="flex py-6 sm:py-10">
                    <div className="shrink-0">
                      <img
                        alt={item.imageAlt}
                        src={item.imageSrc}
                        className="size-24 rounded-md object-cover sm:size-48"
                      />
                    </div>
                
                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <h3 className="text-sm font-medium text-gray-700">{item.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{item.color?.name}</p>
            {item.size?.name && <p className="mt-1 text-sm text-gray-500">{item.size.name}</p>}
            <p className="mt-1 text-sm font-medium text-gray-900">{item.price}</p>
        <div className="mt-4 flex items-center">
          <span className="mr-2 text-sm text-gray-500">Qty:</span>
          <div className="text-sm text-gray-900">1</div>
        </div>
  </div>
          
          {/* Quantity and remove button */}
          <div className="absolute top-0 right-0">
            <button 
              onClick={() => removeFromCart(index)} 
              type="button" 
              className="-m-2 p-2 text-gray-400 hover:text-gray-500">
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </li>
  ))
) : (
  <li className="py-6 text-gray-500">Your cart is empty.</li>
)}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal (inc. VAT)</dt>
                    <dd className="text-sm font-medium text-gray-900">£{subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="flex items-center text-sm text-gray-600">
                    <span>Shipping estimate</span>
                    <div className="relative ml-2 group">
                          <button 
                              type="button"
                              className="shrink-0 text-gray-400 hover:text-gray-500"
                          >
                              <span className="sr-only">Powered by Metapack</span>
                              <QuestionMarkCircleIcon aria-hidden="true" className="size-5" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                              Powered by Metapack
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                      </div>
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">£{shipping.toFixed(2)}</dd>
                </div>
                {/* removed tax section because not applicaple for UK markets */}
                {/* <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="flex text-sm text-gray-600">
                    <span>Tax estimate</span>
                    <a href="#" className="ml-2 shrink-0 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Learn more about how tax is calculated</span>
                        <QuestionMarkCircleIcon aria-hidden="true" className="size-5" />
                    </a>
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">£{tax.toFixed(2)}</dd>
                </div> */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-medium text-gray-900">Order total</dt>
                    <dd className="text-base font-medium text-gray-900">£{total.toFixed(2)}</dd>
                </div>
            </dl>

            <div className="mt-6">
            <Link href="/checkout">
              <button
                type="button"
                className="w-full rounded-md border border-transparent bg-black px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-white hover:text-black hover:border-black  focus:ring-black focus:ring-1 focus:ring-offset-0 focus:outline-hidden"
              >
                Checkout
              </button>
            </Link>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}





