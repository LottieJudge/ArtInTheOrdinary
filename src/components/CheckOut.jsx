'use client'

import { useEffect, useState, useRef } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const products = [
  {
    id: 1,
    title: 'Basic Tee',
    href: '#',
    price: '£32.00',
    color: 'Black',
    size: 'Large',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/checkout-page-02-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  // More products...
]

//Delivery options/sub-options, collection options

function getDeliveryGroupLabel(groupCode) {
  switch (groupCode.toUpperCase()) {
    case 'STANDARD':
    case 'NOMINATED': 
    case 'NEXTDAY':
      return 'Delivery'; // All delivery variants go under "Delivery"
    case 'IN_STORE':
      return 'In-Store Collection'; // In-store collection
    case 'PUDO':
      return 'Local Collection Point'; // In-store collection
    default:
      return groupCode;
  }
}

// map component for PUDO options

function MapComponent({ pudoOptions, onSelectPudo, selectedPudo, searchCenter }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
    container: mapContainer.current,
    style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=Z6KWfABzoUTv2ZQgWxlo',
    center: searchCenter || [-0.1276, 51.5074], // Use search center if available
    zoom: searchCenter ? 12 : 10 // Zoom in more if we have a specific search location
});

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl());

     if (searchCenter) {
      new maplibregl.Marker({ color: 'red' })
        .setLngLat(searchCenter)
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML('<div class="p-2"><p class="text-sm font-medium">Search Location</p></div>')
        )
        .addTo(map.current);
    }

    // Debug: Log the PUDO data to see what fields are available
    console.log('PUDO Options:', pudoOptions);
    console.log('Search Center:', searchCenter);

    let markersAdded = 0;

    // Add markers for each PUDO location
    pudoOptions.forEach((pudo, index) => {
      if (pudo.lat && pudo.long) {
        const marker = new maplibregl.Marker()
          .setLngLat([pudo.long, pudo.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-medium">${pudo.storeName}</h3>
                  <p class="text-sm text-gray-600">${pudo.address}</p>
                  <p class="text-sm text-gray-500">${pudo.postcode}</p>
                </div>
              `)
          )
          .addTo(map.current);

          // Add click handler
        marker.getElement().addEventListener('click', () => {
          onSelectPudo(pudo);
        });

        markers.current.push(marker);
         markersAdded++;
      } else {
        console.warn(`PUDO ${index} missing coordinates:`, pudo);
      }
    });
     

    // Fit map to show all markers
    if (markers.current.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      
      // Include search center in bounds if available
      if (searchCenter) {
        bounds.extend(searchCenter);
      }
      
      markers.current.forEach(marker => {
        bounds.extend(marker.getLngLat());
      });
      
      map.current.fitBounds(bounds, { padding: 50 });
      } else if (searchCenter) {
      // If no PUDO markers but we have a search center, center on that
      map.current.setCenter(searchCenter);
      map.current.setZoom(12);
    }


    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [pudoOptions, onSelectPudo, searchCenter])

  // Highlight selected marker
  useEffect(() => {
    if (!selectedPudo || !map.current) return;

    markers.current.forEach(marker => {
      const element = marker.getElement();
      if (selectedPudo.lat === marker.getLngLat().lat && 
          selectedPudo.long === marker.getLngLat().lng) {
        element.style.filter = 'hue-rotate(120deg)'; // Green highlight
        // Zoom into the selected marker for better street view
      map.current.flyTo({
        center: [selectedPudo.long, selectedPudo.lat],
        zoom: 16, // Higher zoom level to see streets clearly
        duration: 1000 // Smooth animation duration in milliseconds
      });
        
      } else {
        element.style.filter = 'none';
      }
    });
  }, [selectedPudo]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-64 rounded-lg border border-gray-300"
      style={{ minHeight: '256px' }}
    />
  );
}

export default function CheckOut() {

// delivery options logic

const [deliveryOptions, setDeliveryOptions] = useState([]);
const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
const [showDeliverySubOptions, setShowDeliverySubOptions] = useState(false);
const [selectedDeliverySubOption, setSelectedDeliverySubOption] = useState(null);
const [showCalendar, setShowCalendar] = useState(false);
const [selectedDate, setSelectedDate] = useState(null);

// PUDO options logic 

const [showCollectionSearch, setShowCollectionSearch] = useState(false);
const [collectionPostcode, setCollectionPostcode] = useState('');
const [pudoOptions, setPudoOptions] = useState([]);
const [isSearching, setIsSearching] = useState(false);
const [selectedPudoOption, setSelectedPudoOption] = useState(null);
const [searchCenter, setSearchCenter] = useState(null);



// Delivery sub-options 

const deliverySubOptions = [
  { id: 'standard', title: 'Standard delivery', turnaround:"3 - 5 working days", price: '£5.95' },
  { id: 'nominated', title: 'Nominated day', turnaround:"Choose a day that suits you", price: '£8.95' },
  { id: 'timed', title: 'Timed delivery', turnaround:"AM or PM slot", price: '£10.95' },
];


const [orderTotals, setOrderTotals] = useState({
  subtotal: 0,
  shipping: 0,
  vat: 0,
  total: 0
});

// Handle delivery method change
const handleDeliveryMethodChange = (deliveryMethod) => {
  setSelectedDeliveryMethod(deliveryMethod);

 if (deliveryMethod.title === 'Delivery') {
    setShowDeliverySubOptions(true);
    setSelectedDeliverySubOption(deliverySubOptions[0]);
    setShowCollectionSearch(false); // Hide collection search
    setPudoOptions([]); // Clear PUDO options
    setSelectedPudoOption(null); // Clear selected PUDO option
    setCollectionPostcode(''); // Clear postcode input
  } else if (deliveryMethod.title === 'Local Collection Point') {
    setShowCollectionSearch(true); // Show collection search
    setShowDeliverySubOptions(false);
    setSelectedDeliverySubOption(null);
    setShowCalendar(false);
    setSelectedDate(null);
  } else {
    setShowDeliverySubOptions(false);
    setSelectedDeliverySubOption(null);
    setShowCalendar(false);
    setSelectedDate(null);
    setShowCollectionSearch(false); // Hide collection search

    setPudoOptions([]); // Clear PUDO options
    setSelectedPudoOption(null); // Clear selected PUDO option
    setCollectionPostcode(''); // Clear postcode input
  }
};


// Handlers

// Handle collection postcode change
const handleCollectionPostcodeChange = (event) => {
  setCollectionPostcode(event.target.value);
};

// handle collection postcode search with geocoding
const handleCollectionPostcodeSearch = async () => {
  if (!collectionPostcode.trim()) return;
    setIsSearching(true);

    setPudoOptions([]);
    setSelectedPudoOption(null);
  
    try {
    // geocode the postcode using MapTiler
    const geocodeResponse = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(collectionPostcode)}.json?key=Z6KWfABzoUTv2ZQgWxlo&country=GB`
    );
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.features || geocodeData.features.length === 0) {
      console.error('Postcode not found');
      setPudoOptions([]);
      setSearchCenter(null); // ADD THIS LINE - you're missing it
      return;
    }
    
    // Extract coordinates from geocoding result
    const [longitude, latitude] = geocodeData.features[0].center;
    console.log('Geocoded coordinates:', { latitude, longitude });

    // Store search center for map
    setSearchCenter([longitude, latitude]);
    
    // Search for PUDO options using the coordinates
    console.log('Fetching PUDO options from API...'); // ADD THIS LOG
    const pudoResponse = await fetch(`/api/metapack/pudo-options?lat=${latitude}&long=${longitude}`);
    const pudoData = await pudoResponse.json();
    
    console.log('PUDO API response:', pudoData); // ADD THIS LOG
    
    if (pudoData.results) {
      setPudoOptions(pudoData.results);
      console.log('PUDO search results:', pudoData.results);
    } else {
      console.log('No results property in PUDO response'); // ADD THIS LOG
      setPudoOptions([]);
    }
  } catch (error) {
    console.error('Error searching PUDO options:', error);
    setPudoOptions([]);
    setSearchCenter(null); 
  } finally {
    setIsSearching(false);
  }
};

// Handle delivery options 
const handleSubOptionChange = (subOption) => {
  setSelectedDeliverySubOption(subOption);
  
  if (subOption.id === 'nominated') {
    setShowCalendar(true);
    // If availableDates is empty, generate them
    if (availableDates.length === 0) {
      setAvailableDates(getNext14Days([])); // Generate with default availability
    }
  } else {
    setShowCalendar(false);
    setSelectedDate(null);
  }
};



// nominated day delivery options (14 days)
const getNext14Days = (deliveryWindows = []) => {
  const days = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) { // Start from tomorrow
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    
    const isAvailable = deliveryWindows.length > 0 ? deliveryWindows.some(window => {
      const fromDate = new Date(window.from);
      const toDate = new Date(window.to);
      return date >= fromDate && date <= toDate;
    }) : true;
  
      days.push({
        date: date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        monthName: date.toLocaleDateString('en-US', { month: 'short' }),
        isAvailable: isAvailable
      });
    }
   return days.slice(0, 14); // Ensure we get exactly 14 delivery days
};

const [availableDates, setAvailableDates] = useState([]);

const handleDateSelection = (date) => {
  setSelectedDate(date);
};


useEffect(() => {
  async function fetchDeliveryOptions() {
    const response = await fetch("api/metapack/delivery-options");
    const data = await response.json();

    const mapped = data.results.map((option, index) => {
      return {
        id: index + 1,
        title: getDeliveryGroupLabel(option.groupCodes[0]),
        turnaround: getDeliveryWindow(option.delivery),
        price: getPriceLabel(option.groupCodes[0]),
        bookingCode: option.bookingCode,
        carrierServiceCode: option.carrierServiceCode,
        deliveryWindow: option.delivery // Keep the original delivery window
      };
    });
    
   const uniqueOptions = mapped.reduce((acc, current) => {
      const existingOption = acc.find(option => option.title === current.title);
      if (!existingOption) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    setDeliveryOptions(uniqueOptions);
    
    // Extract all delivery windows for calendar availability
    const deliveryWindows = data.results.map(option => option.delivery);
    setAvailableDates(getNext14Days(deliveryWindows));
  }
  fetchDeliveryOptions();
}, []);


useEffect(() => {
  const subtotal = products.reduce((sum, product) => {
    const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ''));
    return sum + price;
  }, 0);
  
  const shipping = selectedDeliverySubOption ? 
    parseFloat(selectedDeliverySubOption.price.replace('£', '')) : 0;
  
  const vat = subtotal * 0.20;
  
  setOrderTotals({
    subtotal: subtotal, 
    shipping: shipping,
    vat: vat, 
    total: subtotal + shipping 
  });
}, [products, selectedDeliverySubOption]);

function getDeliveryWindow({ from, to }) {
  if (!from || !to) return '';
  const fromDate = new Date(from).toLocaleDateString();
  const toDate = new Date(to).toLocaleDateString();
  return `Estimated: ${fromDate} – ${toDate}`;
}

function getPriceLabel(groupCode) {
  switch (groupCode.toUpperCase()) {
    case 'STANDARD':
      return '£5.95';
    case 'NOMINATED':
      return 'From £8.95';
    case 'NEXTDAY':
      return 'From £10.95';
    default:
      return '£6.95';
  }
}



const paymentMethods = [
  { id: 'credit-card', title: 'Credit card' },
  { id: 'paypal', title: 'PayPal' },
  { id: 'etransfer', title: 'eTransfer' },
]

  const router = useRouter()
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


  const handleChange = (inputEvent) => {
  const { name, value } = inputEvent.target
  setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
}

const handleSubmit = async (formSubmitEvent) => {
  formSubmitEvent.preventDefault();
  
  try {
    // Determine which bookingCode to use based on delivery method selected
    let bookingCodeToSend;
    
    if (showCollectionSearch && selectedPudoOption) {
      bookingCodeToSend = selectedPudoOption.bookingCode;
    } else if (selectedDeliverySubOption) {
      bookingCodeToSend = selectedDeliverySubOption.bookingCode;
      
      if (selectedDeliverySubOption.id === 'nominated' && selectedDate) {
        bookingCodeToSend = `${bookingCodeToSend}/${selectedDate.date.toISOString().split('T')[0]}`;
      }
    } else if (selectedDeliveryMethod) {
      bookingCodeToSend = selectedDeliveryMethod.bookingCode;
    } else {
      throw new Error('No valid delivery method or collection option selected. Please select a delivery or collection method.');
    }
    
    // Create a summary of ordered items
    const itemCount = products.length;
    const itemSummary = itemCount > 1 
      ? `${itemCount} items including ${products[0].title}`
      : products[0].title;
      
    // Create detailed items array for the API
    const itemsDetails = products.map((product, index) => ({
      itemRef: `item-${index + 1}`,
      description: `${product.title} (${product.color}, ${product.size})`,
      quantity: 1, // Ideally this would come from the product quantity
      value: parseFloat(product.price.replace(/[^0-9.-]+/g, ''))
    }));
    
    // Add product information to form data
    const orderData = {
      ...formData,
      bookingCode: bookingCodeToSend,
      country: formData.country,
      item_ordered: itemSummary, // Summary for backward compatibility 
      items_details: itemsDetails // Detailed array of all products
    };
    
    // generate the shipping label
    const labelResponse = await fetch('/api/metapack/generate-shipping-label', {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!labelResponse.ok) {
      throw new Error('Failed to generate shipping label');
    }
    
    const labelData = await labelResponse.json();
    console.log('Shipping label generated:', labelData);
    
    // send confirmation email
    const emailResponse = await fetch('/api/send-order-confirmation', {
      method: 'POST',
      body: JSON.stringify({
        order: orderData,
        label: labelData,
        customer: {
          name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email_address
        }
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!emailResponse.ok) {
      throw new Error('Failed to send confirmation email');
    }
    
    console.log('Order submitted successfully');
    router.push('/confirmation');
  } catch (error) {
    console.error('Error:', error.message);
  }
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
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email_address"
                    name="email_address"
                    type="email"
                    value={formData.email_address}
                    onChange={handleChange}
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm/6 font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm/6 font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="company_name" className="block text-sm/6 font-medium text-gray-700">
                    Company
                  </label>
                  <div className="mt-2">
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="firstLine_address" className="block text-sm/6 font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="firstLine_address"
                      name="firstLine_address"
                      type="text"
                      value={formData.firstLine_address}
                      onChange={handleChange}
                      autoComplete="street-address"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="house_apartment_number" className="block text-sm/6 font-medium text-gray-700">
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-2">
                    <input
                      id="house_apartment_number"
                      name="house_apartment_number"
                      type="text"
                      value={formData.house_apartment_number}
                      onChange={handleChange}
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm/6 font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      autoComplete="address-level2"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm/6 font-medium text-gray-700">
                    Country
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      autoComplete="country-name"
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option>United Kingdom</option>
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
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="post_code" className="block text-sm/6 font-medium text-gray-700">
                    Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      id="post_code"
                      name="post_code"
                      type="text"
                      value={formData.post_code}
                      onChange={handleChange}
                      autoComplete="postal-code"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone_number" className="block text-sm/6 font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone_number"
                      name="phone_number"
                      type="text"
                      value={formData.phone_number}
                      onChange={handleChange}
                      autoComplete="tel"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>

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
                      aria-label={deliveryMethod.title}
                      aria-description={`${deliveryMethod.turnaround} for ${deliveryMethod.price}`}
                      className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-xs focus:outline-hidden data-checked:border-transparent data-focus:ring-2 data-focus:ring-indigo-500"
                    >
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">{deliveryMethod.title}</span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            {deliveryMethod.turnaround}
                          </span>
                          <span className="mt-6 text-sm font-medium text-gray-900">{deliveryMethod.price}</span>
                        </span>
                      </span>
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="size-5 text-indigo-600 group-not-data-checked:hidden"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-checked:border-indigo-500 group-data-focus:border"
                      />
                    </Radio>
                  ))}
                </RadioGroup>

                {/* Sub-delivery options for Delivery */}
                {showDeliverySubOptions && (
                  <div className="mt-6 pl-4 border-l-2 border-gray-200">
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
                            className="size-5 text-indigo-600 group-not-data-checked:hidden"
                          />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-checked:border-indigo-500 group-data-focus:border"
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
    key={index}
    type="button"
    onClick={() => day.isAvailable ? handleDateSelection(day) : null}
    disabled={!day.isAvailable}
    className={`
      relative flex flex-col items-center justify-center p-3 text-xs rounded-lg border overflow-hidden
      ${!day.isAvailable 
        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
        : selectedDate?.date.getTime() === day.date.getTime()
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
      }
      transition-colors duration-200
    `}
  >
    {/* Diagonal line for unavailable dates */}
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
          className="flex-1 rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
        />
        <button
          type="button"
          onClick={handleCollectionPostcodeSearch}
          disabled={isSearching || !collectionPostcode.trim()}
          className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-2 focus:outline-indigo-600"
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
        searchCenter={searchCenter} // searchCenter will be valid here
      />
    </div>

    {/* Conditionally show the list of PUDO options */}
    {pudoOptions.length > 0 && (
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {pudoOptions.map((pudo, index) => (
          <div 
            key={`${pudo.storeId}-${index}-${pudo.lat}-${pudo.long}`}
            onClick={() => setSelectedPudoOption(pudo)}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedPudoOption?.storeId === pudo.storeId 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <h5 className="font-medium text-gray-900">{pudo.storeName}</h5>
            <p className="text-sm text-gray-600">{pudo.address}</p>
            <p className="text-sm text-gray-500">{pudo.postcode}</p>
          </div>
        ))}
      </div>
    )}
  </div>
)}
          
            {/* Payment */}
            <div className="mt-10 border-t border-gray-200 pt-10">
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
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-xs">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {products.map((product) => (
                  <li key={product.id} className="flex px-4 py-6 sm:px-6">
                    <div className="shrink-0">
                      <img alt={product.imageAlt} src={product.imageSrc} className="w-20 rounded-md" />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <a href={product.href} className="font-medium text-gray-700 hover:text-gray-800">
                              {product.title}
                            </a>
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                          <p className="mt-1 text-sm text-gray-500">{product.size}</p>
                        </div>

                        <div className="ml-4 flow-root shrink-0">
                          <button
                            type="button"
                            className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Remove</span>
                            <TrashIcon aria-hidden="true" className="size-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="mt-1 text-sm font-medium text-gray-900">{product.price}</p>

                        <div className="ml-4">
                          <div className="grid grid-cols-1">
                            <select
                              id="quantity"
                              name="quantity"
                              aria-label="Quantity"
                              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                              <option value={6}>6</option>
                              <option value={7}>7</option>
                              <option value={8}>8</option>
                            </select>
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                          </div>
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
        
                  <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
                >
                  Confirm order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}