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


  //click and collect 
  const [showClickCollect, setShowClickCollect] = useState(false);
  const [selectedClickCollectLocation, setSelectedClickCollectLocation] = useState(null);

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
    
    // Clear delivery options if address becomes incomplete
    if (!isComplete) {
    setSelectedDeliveryMethod(null);
    setSelectedDeliverySubOption(null);
    setShowDeliverySubOptions(false);
    setShowCollectionSearch(false);
    setShowCalendar(false);
    setSelectedDate(null);
    setPudoOptions([]);
    setSelectedPudoOption(null);
  } else {
    setSelectedDeliverySubOption(null);
    setShowCalendar(false);
    setSelectedDate(null);
  }
 }, [formData]);

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

    try {
      let bookingCodeToSend;
      
      if (showCollectionSearch && selectedPudoOption) {
      bookingCodeToSend = selectedPudoOption.bookingCode;
    } else if (selectedDeliverySubOption) {
      if (selectedDeliverySubOption.id === 'nominated' && selectedDate) {
        // Use the actual booking code from the selected date's delivery windows
        if (selectedDate.deliveryWindows && selectedDate.deliveryWindows.length > 0) {
          // Use the first available delivery window's booking code
          bookingCodeToSend = selectedDate.deliveryWindows[0].bookingCode;
          console.log('Using nominated day booking code:', bookingCodeToSend);
        } else {
          throw new Error('No delivery window available for selected date.');
        }
      } else if (selectedDeliverySubOption.id === 'standard') {
        if (selectedDeliverySubOption.bookingCode) {
          bookingCodeToSend = selectedDeliverySubOption.bookingCode;
          console.log('Using standard delivery booking code:', bookingCodeToSend);
        } else {
          throw new Error('No booking code available for standard delivery.');
        }
      
      } else {
        // For other delivery sub-options (standard)
        bookingCodeToSend = selectedDeliverySubOption.bookingCode;
      }
    } else if (selectedDeliveryMethod) {
      bookingCodeToSend = selectedDeliveryMethod.bookingCode;
    } else {
      throw new Error('No valid delivery method or collection option selected.');
    }

     console.log('Final booking code to send:', bookingCodeToSend);

     // ADD THIS ENRICHMENT CODE HERE - RIGHT AFTER booking code logic
    const enrichedCartItems = cartItems.map(item => {
      // Find the product data by matching name
      const productKey = Object.keys(products).find(key => 
        products[key].name === item.name
      );
      
      const product = productKey ? products[productKey] : null;
      
      // Extract plain text description
      const getPlainDescription = (htmlDesc) => {
        if (!htmlDesc) return item.name;
        return htmlDesc.replace(/<[^>]*>/g, '').trim();
      };
      
      return {
        ...item,
        description: product ? getPlainDescription(product.description) : item.name,
      };
    });
    
    console.log('Enriched cart items with descriptions:', enrichedCartItems);
   

      const itemCount = cartItems.length;
      const firstItemName = cartItems[0]?.name || 'Item';
      const itemSummary = itemCount > 1 
        ? `${itemCount} items including ${firstItemName}`
        : firstItemName;
    
    const { data: orderData, error: orderError } = await supabase
    .from('CustomerInfo')
    .insert([{
      first_name: formData.first_name,
      last_name: formData.last_name,
      email_address: formData.email_address,
      company_name: formData.company_name,
      firstLine_address: formData.firstLine_address,
      house_apartment_number: formData.house_apartment_number,
      city: formData.city,
      country: formData.country,
      state_province: formData.state_province,
      post_code: formData.post_code,
      phone_number: formData.phone_number,
      item_ordered: JSON.stringify(cartItems),
      size: cartItems[0]?.size || '',
      marketing_consent: consentCheckboxes.marketing,
      privacy_policy_consent: consentCheckboxes.privacyPolicy,
      consent_timestamp: new Date().toISOString()
    }])
    .select();
    if (orderError) {
      console.error('Supabase insert error:', orderError);
    }
    const orderId = orderData[0].id;
    // generate the shipping label
    const labelResponse = await fetch('/api/metapack/generate-shipping-label', {
      method: 'POST',
      // again this needed to work with the supabase info so had to bulk out 
      body: JSON.stringify({
        ...formData,
        bookingCode: bookingCodeToSend,
        cartItems: enrichedCartItems,
        selectedDate,
        selectedDeliveryMethod,
        selectedDeliverySubOption,
        selectedPudoOption,
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("Label Response" + labelResponse)
    console.log('Production debug - Label response status:', labelResponse.status);
    
    if (!labelResponse.ok) {
      const errorText = await labelResponse.text();
      console.error('Production debug - Label response error:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        console.error('Production debug - Parsed error data:', errorData);
        throw new Error(`Shipping label failed: ${errorData.error}. Details: ${JSON.stringify(errorData.details)}`);
      } catch (parseError) {
        throw new Error(`Shipping label failed with status ${labelResponse.status}. Response: ${errorText}`);
      }
    }

    const labelData = await labelResponse.json();
    console.log('Production debug - Shipping label generated:', labelData);

    const emailResponse = await fetch('/api/email/send', {
      method: 'POST',
      body: JSON.stringify({
        to: formData.email_address,
        subject: 'Order Confirmation - Maison Metapack',
        data: {
          firstName: formData.first_name,
          orderDetails: {
            orderNumber: `MM-${orderId}`,
            items: cartItems,
            totals: orderTotals,
            deliveryMethod: selectedDeliveryMethod,
            deliverySubOption: selectedDeliverySubOption,
            selectedDate: selectedDate,
            pudoOption: selectedPudoOption,
            shippingLabel: labelData
          },
          shipping: {
            name: `${formData.first_name} ${formData.last_name}`,
            address: formData.firstLine_address,
            city: formData.city,
            postcode: formData.post_code
          }
        }
      }),
      headers: { 'Content-Type': 'application/json' }
        });
        if (!emailResponse.ok) {
          throw new Error('Failed to send confirmation email');
        }

    console.log('Order submitted successfully');

    const orderSummary = {
      items: cartItems.map(item => ({
        ...item,
        total: (typeof item.price === 'string' 
          ? parseFloat(item.price.replace('£', '')) 
          : item.price) * item.quantity
      })),
      totals: orderTotals,
      delivery: {
        method: selectedDeliveryMethod,
        subOption: selectedDeliverySubOption,
        date: selectedDate,
        pudoOption: selectedPudoOption
      },
      customerInfo: formData
    };

     // Store in sessionStorage instead of URL
    sessionStorage.setItem('orderData', JSON.stringify(orderSummary));
    clearCart();
    router.push('/confirmation');
      } catch (error) {
    console.error('Error:', error.message);
    alert(`Order submission failed: ${error.message}`);
    }
  };

  // GDPR handler

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
{/* local collection point options */}
            {showCollectionSearch && (
              <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Where would you like to collect from?</h3>
    <p className="text-sm text-gray-600 mb-4">Choose from thousands of collection points nationwide</p>
    <div className="mt-4">
      <label htmlFor="collection-postcode" className="block text-sm font-medium text-gray-700 mb-2">
        Search by town, city or postcode
      </label>
      <div className="flex gap-3">
        <input
          id="collection-postcode"
          name="collection-postcode"
          type="text"
          value={collectionPostcode}
          onChange={handleCollectionPostcodeChange}
          placeholder="e.g. SW1A 1AA"
          className="flex-1 rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#303efaff] sm:text-sm"
        />
        <button
          type="button"
          onClick={handleCollectionPostcodeSearch}
          disabled={isSearching || !collectionPostcode.trim()}
          className="px-6 py-2 bg-[#11003aff] text-white text-sm font-medium rounded-md hover:bg-[#303efaff] focus:outline-2 focus:outline-black"
        >
        {isSearching ? 'Searching...' : 'Search'} 
        </button>
      </div>
    </div>
  </div>
)}

{/* Conditional rendering for the entire PUDO results section, including the map */}
{showCollectionSearch && searchCenter && (
  <div className="mt-4">
    {/* Conditionally show "Found X points" only if there are results */}
    {pudoOptions.length > 0 && (
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Found {pudoOptions.length} collection point{pudoOptions.length !== 1 ? 's' : ''}
      </h4>
    )}
    
    {/* Map Container - This will now render if searchCenter is set */}
    <div className="mb-4">
      <MapComponent 
        pudoOptions={pudoOptions} 
        onSelectPudo={setSelectedPudoOption}
        selectedPudo={selectedPudoOption}
        searchCenter={searchCenter}
      />
    </div>

    {/* Conditionally show the list of PUDO options */}
    {pudoOptions.length > 0 && (
  <div 
    ref={pudoListRef}
    className="space-y-2 max-h-60 overflow-y-auto"
  >
    {pudoOptions.map((pudo, index) => (
      <div 
        key={`${pudo.storeId}-${index}-${pudo.lat}-${pudo.long}`}
        data-pudo-id={`${pudo.storeId}-${pudo.lat}-${pudo.long}`} // Add this data attribute
        onClick={() => setSelectedPudoOption(pudo)}
        className={`p-3 border rounded-md cursor-pointer transition-colors ${
          selectedPudoOption && (
            selectedPudoOption.storeId === pudo.storeId && 
            selectedPudoOption.storeName === pudo.storeName &&
            Math.abs(selectedPudoOption.lat - pudo.lat) < 0.0001 && 
            Math.abs(selectedPudoOption.long - pudo.long) < 0.0001
          )
            ? 'border-[#303efaff] bg-[#303efaff]/10 hover:bg-[#303efaff]/20' 
            : 'border-gray-200 bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex justify-between items-start">
  <div className="flex-1">
    <h5 className="font-medium text-gray-900">{pudo.storeName}</h5>
    <p className="text-sm text-gray-600">{pudo.address}</p>
    <p className="text-sm text-gray-500">{pudo.postcode}</p>
  </div>
  
          {/* Price display with loading state */}
          <div className="text-right">
            {selectedPudoOption?.storeId === pudo.storeId && selectedPudoOption?.loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-900">
                  {selectedPudoOption?.storeId === pudo.storeId && selectedPudoOption?.shippingCost 
                    ? `£${selectedPudoOption.shippingCost.toFixed(2)}`
                    : pudo.shippingCost 
                      ? `£${pudo.shippingCost.toFixed(2)}`
                      : '£3.95'
                  }
                </p>
                <p className="text-xs text-gray-500">Collection fee</p>
              </>
            )}
          </div>
        </div>
        
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-green-700">
                      {formatOpeningHours(pudo.storeTimes)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1" title={getWeeklyHours(pudo.storeTimes)}>
                      {getWeeklyHours(pudo.storeTimes)}
                    </p>
                      </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}     
              {/* Click & Collect Options */}
{showClickCollect && (
  <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose a collection office</h3>
    <p className="text-sm text-gray-600 mb-4">Select from our global office locations</p>
    
    <div className="space-y-3">
      {clickCollectLocations.map((location) => (
        <div
          key={location.id}
          onClick={() => location.status === 'available' ? setSelectedClickCollectLocation(location) : null}
          className={`p-4 border rounded-lg transition-colors ${
            location.status === 'unavailable' 
              ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-75'
              : selectedClickCollectLocation?.id === location.id
                ? 'border-[#303efaff] bg-[#303efaff]/10 cursor-pointer hover:bg-[#303efaff]/20'
                : 'border-gray-200 bg-white cursor-pointer hover:bg-gray-50'
          }`}
        >
        <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">{location.name}</h4>
                {location.status === 'unavailable' && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{location.address}</p>
              <p className="text-sm text-gray-600">{location.city}, {location.country}</p>
              <p className="text-sm text-gray-500">{location.postcode}</p>
            </div>

            {location.status === 'unavailable' && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Not Available</p>
                <p className="text-xs text-gray-400">Contact us for info</p>
              </div>
            )}
          </div>
          
          {location.status === 'unavailable' && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                This collection point is not yet available. Please select one of the other delivery options to complete your order.
              </p>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Info message */}
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <p className="text-sm text-blue-800">
        <span className="font-medium">Please note:</span> Click & Collect is coming soon! 
        To complete your order today, please choose "Delivery" or "Local Collection Point" options above.
      </p>
    </div>
  </div>
)}


            {/* Payment */}
            </div>
        {/*   <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Payment</h2>

              <fieldset className="mt-4">
                <legend className="sr-only">Payment type</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                  {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                    <div key={paymentMethod.id} className="flex items-center">
                      <input
                        defaultChecked={paymentMethodIdx === 0}
                        id={paymentMethod.id}
                        name="payment-type"
                        type="radio"
                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                      />
                      <label htmlFor={paymentMethod.id} className="ml-3 block text-sm/6 font-medium text-gray-700">
                        {paymentMethod.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                <div className="col-span-4">
                  <label htmlFor="card-number" className="block text-sm/6 font-medium text-gray-700">
                    Card number
                  </label>
                  <div className="mt-2">
                    <input
                      id="card-number"
                      name="card-number"
                      type="text"
                      autoComplete="cc-number"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-4">
                  <label htmlFor="name-on-card" className="block text-sm/6 font-medium text-gray-700">
                    Name on card
                  </label>
                  <div className="mt-2">
                    <input
                      id="name-on-card"
                      name="name-on-card"
                      type="text"
                      autoComplete="cc-name"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-3">
                  <label htmlFor="expiration-date" className="block text-sm/6 font-medium text-gray-700">
                    Expiration date (MM/YY)
                  </label>
                  <div className="mt-2">
                    <input
                      id="expiration-date"
                      name="expiration-date"
                      type="text"
                      autoComplete="cc-exp"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-sm/6 font-medium text-gray-700">
                    CVC
                  </label>
                  <div className="mt-2">
                    <input
                      id="cvc"
                      name="cvc"
                      type="text"
                      autoComplete="csc"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-xs">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.cartItemKey} className="flex px-4 py-6 sm:px-6">
                    <div className="shrink-0">
                      <img alt={item.imageAlt} src={item.imageSrc} className="w-20 rounded-md" />
                    </div>
                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <a href={item.href} className="font-medium text-gray-700 hover:text-gray-800">
                              {item.name}
                            </a>
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">{item.color.name}</p>
                          <p className="mt-1 text-sm text-gray-500">{item.size.name}</p>
                        </div>
                        <div className="ml-4 flex flex-col">
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            £{((typeof item.price === 'string' 
                              ? parseFloat(item.price.replace('£', '')) 
                              : item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal (inc. VAT)</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    £{orderTotals.subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    £{orderTotals.shipping.toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <dt>VAT (included)</dt>
                  <dd>£{orderTotals.vat.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    £{orderTotals.total.toFixed(2)}
                  </dd>
                </div>
              </dl>
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
      </div>
    </div>
        

                  <button
                    type="submit"
                    disabled={
                      isLoadingDeliveryOptions ||
                      !isDeliverySelectionComplete() || 
                      !consentCheckboxes.privacyPolicy ||
                      showClickCollect ||
                      isSubmittingOrder
                    }
                    className={`w-full rounded-md border border-transparent ${
                      isLoadingDeliveryOptions || !isDeliverySelectionComplete() || !consentCheckboxes.privacyPolicy || showClickCollect || isSubmittingOrder
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-black hover:bg-white hover:text-black hover:border-black'
                    } px-4 py-3 text-base font-medium text-white shadow-xs  focus:ring-black focus:ring-1 focus:ring-offset-0 focus:outline-hidden`}
                  >
                    {isSubmittingOrder 
                      ? 'Processing order...'           // When submitting the order
                      : isLoadingDeliveryOptions        // When loading delivery data  
                        ? 'Loading delivery options...' 
                        : !isDeliverySelectionComplete() // When delivery selection is incomplete
                          ? 'Please select a delivery option'
                        : !consentCheckboxes.privacyPolicy
                          ? 'Please accept privacy policy to continue'
                          : showClickCollect
                            ? 'Click & Collect coming soon - choose another option'
                            : 'Confirm order'
                    }
                  </button>
              </div>
            </div>
        </form>
        </div>  
  )
}