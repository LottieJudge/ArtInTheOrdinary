import { Suspense } from 'react'
import OrderConfirmation from "@/components/OrderConfirmation"

export const metadata = {
  title: "Order Confirmation",
  description: "Order Confirmation page for your purchase",
  keywords: "Order, Confirmation, Purchase, Receipt, Shopping, E-commerce",
}

function OrderConfirmationContent() {
  return <OrderConfirmation />
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="bg-white min-h-screen flex items-center justify-center">Loading order details...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}