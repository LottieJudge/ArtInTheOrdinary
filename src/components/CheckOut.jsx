'use client'

import { useEffect, useState, useRef } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useCart } from '../context/CartContext';
import { products } from '@/data/products'

import { createClient } from '@supabase/supabase-js';

// supa envs 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);




// Required address fields
const requiredAddressFields = [
  'email_address',
  'first_name',
  'last_name',
  'company_name',
  'firstLine_address',
  'city',
  'country',
  'post_code',
  'phone_number'
];

export default function CheckOut() {
  const { cartItems, cartTotal, cartSubtotal, cartVAT, clearCart } = useCart();

  useEffect(() => {
    console.log('📄 CHECKOUT PAGE LOADED at:', new Date().toISOString());
    console.log('📄 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      hasSupabaseURL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      currentURL: window.location.href
    });
  }, []);

const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_address: '',
    company_name: '',
    firstLine_address: '',
    house_apartment_number: '',
    city: '',
    country: 'United Kingdom',
    state_province: '',
    post_code: '',
    phone_number: '',
    item_ordered: '',
    size: '',
  })


 
  const [isLoadingDeliveryOptions, setIsLoadingDeliveryOptions] = useState(false);
  const [isDeliveryDataReady, setIsDeliveryDataReady] = useState(false);

  // address validation logic
  const [isAddressComplete, setIsAddressComplete] = useState(false);

  // GDPR Consent
  const [consentCheckboxes, setConsentCheckboxes] = useState({
  marketing: false,
  privacyPolicy: false
});

  // order submit loading state
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);


  // Check if address is complete
  useEffect(() => {
    const isComplete = requiredAddressFields.every(field => 
      formData[field] && formData[field].trim() !== ''
    );
    setIsAddressComplete(isComplete);


  const [orderTotals, setOrderTotals] = useState({
    subtotal: 0,
    shipping: 0,
    vat: 0,
    total: 0
  });

  useEffect(() => {
    const subtotal = cartItems.reduce((acc, item) => {
      const itemPrice = typeof item.price === 'string' 
        ? parseFloat(item.price.replace('£', '')) 
        : item.price;
      return acc + (itemPrice * item.quantity);
    }, 0);

    const shippingCost = 4.95;  
    const vat = subtotal * 0.20;
    const total = subtotal + shippingCost;

    setOrderTotals({
      subtotal,
      shipping: shippingCost,
      vat,
      total
    });
  }, [cartItems]);

  const paymentMethods = [
    { id: 'credit-card', title: 'Credit card' },
    { id: 'paypal', title: 'PayPal' },
    { id: 'etransfer', title: 'eTransfer' },
  ]

  const router = useRouter()
  
  const handleChange = (inputEvent) => {
  const { name, value } = inputEvent.target
  setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
}

  const handleSubmit = async (formSubmitEvent) => {
    formSubmitEvent.preventDefault();

  setIsSubmittingOrder(true);

    if (showDeliverySubOptions && !selectedDeliverySubOption) {
    alert('Please select a delivery option.');
    return;
  }

  const handleConsentChange = (checkboxType) => {
  setConsentCheckboxes(prev => ({
    ...prev,
    [checkboxType]: !prev[checkboxType]
  }));
};
 

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>
        <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
              <div className="mt-4">
                <label htmlFor="email_address" className="block text-sm/6 font-medium text-gray-700">
                  Email address <span className="text-black">*</span>
                </label>
                <div className="mt-2">
                  <input
                    id="email_address"
                    name="email_address"
                    type="email"
                    value={formData.email_address}
                    onChange={handleChange}
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-700">
                    First name <span className="text-black">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-700">
                    Last name <span className="text-black">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="company_name" className="block text-sm/6 font-medium text-gray-700">
                    Company <span className="text-black">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="firstLine_address" className="block text-sm/6 font-medium text-gray-700">
                    Address <span className="text-black">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="firstLine_address"
                      name="firstLine_address"
                      type="text"
                      value={formData.firstLine_address}
                      onChange={handleChange}
                      autoComplete="street-address"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    />
                  </div>
                </div>


                <div>
                  <label htmlFor="city" className="block text-sm/6 font-medium text-gray-700">
                    City <span className="text-black">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      autoComplete="address-level2"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm/6 font-medium text-gray-700">
                    Country <span className="text-black">*</span>
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      autoComplete="country-name"
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Italy">Italy</option>
                      <option value="Spain">Spain</option>
                      <option value="Netherlands">Netherlands</option>
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="state_province" className="block text-sm/6 font-medium text-gray-700">
                    State / Province
                  </label>
                  <div className="mt-2">
                    <input
                      id="state_province"
                      name="state_province"
                      type="text"
                      value={formData.state_province}
                      onChange={handleChange}
                      autoComplete="address-level1"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="post_code" className="block text-sm/6 font-medium text-gray-700">
                    Postal code <span className="text-black">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="post_code"
                      name="post_code"
                      type="text"
                      value={formData.post_code}
                      onChange={handleChange}
                      autoComplete="postal-code"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone_number" className="block text-sm/6 font-medium text-gray-700">
                    Phone <span className="text-black">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone_number"
                      name="phone_number"
                      type="text"
                      value={formData.phone_number}
                      onChange={handleChange}
                      autoComplete="tel"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>

                    {isAddressComplete ? (
            <div className="mt-10 border-t border-gray-200 pt-10">
              <fieldset>
                <legend className="text-lg font-medium text-gray-900">Delivery method</legend>
                <RadioGroup
                  value={selectedDeliveryMethod}
                  onChange={handleDeliveryMethodChange}
                  className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
                >
                  {deliveryOptions.map((deliveryMethod) => (
                     <Radio
    key={deliveryMethod.id}
    value={deliveryMethod}
    disabled={deliveryMethod.disabled} 
    aria-label={deliveryMethod.title}
    aria-description={`${deliveryMethod.turnaround} for ${deliveryMethod.price}`}
    className={`group relative flex rounded-lg border p-4 shadow-xs focus:outline-hidden data-checked:border-transparent data-focus:ring-2 data-focus:ring-indigo-500 ${
      deliveryMethod.unavailable 
        ? 'cursor-not-allowed bg-gray-100 border-gray-200 opacity-75' 
        : 'cursor-pointer bg-white border-gray-300'
    }`}
  >
    <span className="flex flex-1">
      <span className="flex flex-col">
        <span className={`block text-sm font-medium ${
          deliveryMethod.unavailable ? 'text-gray-500' : 'text-gray-900'
        }`}>
          {deliveryMethod.title}
        </span>
        <span className={`mt-1 flex items-center text-sm ${
          deliveryMethod.unavailable ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {deliveryMethod.turnaround}
        </span>
        <span className={`mt-6 text-sm font-medium ${
          deliveryMethod.unavailable ? 'text-gray-400' : 'text-gray-900'
        }`}>
          {deliveryMethod.price}
        </span>
      </span>
    </span>
    {!deliveryMethod.unavailable && ( // ✅ ONLY SHOW CHECK ICON IF AVAILABLE
      <CheckCircleIcon
        aria-hidden="true"
        className="size-5 text-[#303efaff] group-not-data-checked:hidden"
      />
    )}
     <span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-checked:border-black group-data-focus:border"
    />
          </Radio>
                  ))}
                </RadioGroup>

                {/* Sub-delivery options for Delivery */}
                {showDeliverySubOptions && (
                  <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Choose delivery type</h3>
                    <RadioGroup
                      value={selectedDeliverySubOption}
                      onChange={handleSubOptionChange}
                      className="space-y-4"
                    >
                      {deliverySubOptions.map((subOption) => (
                        <Radio
                          key={subOption.id}
                          value={subOption}
                          disabled={subOption.disabled}
                          aria-label={subOption.title}
                          aria-description={`${subOption.turnaround} for ${subOption.price}`}
                          className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-4 shadow-xs focus:outline-hidden data-checked:border-transparent data-focus:ring-2 data-focus:ring-indigo-500"
                        >
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <span className="block text-sm font-medium text-gray-900">{subOption.title}</span>
                              <span className="mt-1 flex items-center text-sm text-gray-500">
                                {subOption.turnaround}
                              </span>
                              <span className="mt-2 text-sm font-medium text-gray-900">{subOption.price}</span>
                            </span>
                          </span>
                          <CheckCircleIcon
                            aria-hidden="true"
                            className="size-5 text-[#303efaff] group-not-data-checked:hidden"
                          />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-checked:border-black group-data-focus:border"
                          />
                        </Radio>
                      ))}
                    </RadioGroup>
                    
                    {/* Calendar for Nominated Day */}
                    {showCalendar && (
                      <div className="mt-6 pl-4 border-l-2 border-gray-100">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Choose your delivery date</h4>
                        <div className="grid grid-cols-7 gap-2">
                          {availableDates.map((day, index) => (
                            <button
                              key={`calendar-date-${day.date.getTime()}-${index}`}
                              type="button"
                              onClick={() => day.isAvailable ? handleDateSelection(day) : null}
                              disabled={!day.isAvailable}
                              className={`
                                relative flex flex-col items-center justify-center p-3 text-xs rounded-lg border overflow-hidden
                                ${!day.isAvailable 
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                  : selectedDate?.date.getTime() === day.date.getTime()
                                    ? 'bg-[#303efaff] text-white border-[#303efaff] hover:bg-[#303efaff]/90'
                                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                                }
                                transition-colors duration-200
                              `}
                            >
                              {day.bookingCode && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-[#22ee88ff] rounded-full"></div>
                              )}
                              {!day.isAvailable && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-full h-px bg-gray-300 transform rotate-45"></div>
                                </div>
                              )}
                              <span className="font-medium relative z-10">{day.dayName}</span>
                              <span className="text-xs mt-1 relative z-10">{day.dayNumber}</span>
                              <span className="text-xs relative z-10">{day.monthName}</span>
                            </button>
                          ))}
                        </div>
                        {selectedDate && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800">
                              <span className="font-medium">Selected:</span> {selectedDate.date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </fieldset>
            </div>
          ) : (
            // Show placeholder when address is incomplete
            <div className="mt-10 border-t border-gray-200 pt-10">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delivery Options</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please complete your address information to see available delivery options.
                </p>
                <div className="text-sm text-gray-500">
                  Required fields: {requiredAddressFields.map(field => 
                    !formData[field] || formData[field].trim() === '' ? (
                      <span key={field} className="inline-block text-[#fc5800ff] bg-[#fc5800ff]/10 px-2 py-1 rounded text-xs mr-1 mb-1">
                        {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          )}
