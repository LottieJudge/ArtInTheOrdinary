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
        .setHTML(`
          <div class="p-2">
            <h3 class="font-medium">Search Location</h3>
            <p class="text-sm text-gray-600">Your search area</p>
          </div>
        `)
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
            new maplibregl.Popup({ 
              offset: 25 
            })
              .setHTML(`
                <div style="padding: 6px; font-size: 11px; line-height: 1.2; max-width: 180px;">
    <div style="font-weight: 600; margin-bottom: 3px;">${pudo.storeName}</div>
    <div style="color: #666; margin-bottom: 2px;">${pudo.address}</div>
    <div style="color: #999; margin-bottom: 4px; font-size: 10px;">${pudo.postcode}</div>
    <div style="border-top: 1px solid #eee; padding-top: 3px; margin-top: 3px;">
      <div style="color: #059669; font-weight: 500; font-size: 10px;">
        ${formatOpeningHours(pudo.storeTimes)}
      </div>
    </div>
  </div>
              `)
          )
          .addTo(map.current);

          // Add click handler
        marker.getElement().addEventListener('click', () => {
  console.log('Map marker clicked:', pudo.storeName);
  console.log('Calling onSelectPudo with:', pudo);
  onSelectPudo(pudo);
  
  // Scroll within the PUDO list container, not the entire viewport
  setTimeout(() => {
    const selectedElement = document.querySelector(`[data-pudo-id="${pudo.storeId}-${pudo.lat}-${pudo.long}"]`);
    const pudoListContainer = document.querySelector('.space-y-2.max-h-60.overflow-y-auto');
    
    if (selectedElement && pudoListContainer) {
      // Calculate position relative to the container
      const containerRect = pudoListContainer.getBoundingClientRect();
      const elementRect = selectedElement.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + pudoListContainer.scrollTop;
      
      // Scroll the container so the selected element is at the top
      pudoListContainer.scrollTo({
        top: relativeTop,
        behavior: 'smooth'
      });
    }
  }, 100);
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
  }, [pudoOptions, onSelectPudo, searchCenter]);

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
        zoom: 15, // Higher zoom level to see streets clearly
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
      className="w-full h-80 rounded-lg border border-gray-300"
      style={{ minHeight: '256px' }}
    />
  );
}

// Pudo opening hours function

function formatOpeningHours(storeTimes) {
  if (!storeTimes) return 'Hours not available';
  
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[today];
  
  // Check if store is open today
  const todaysHours = storeTimes[currentDay];
  
  if (!todaysHours || todaysHours.length === 0) {
    return 'Closed today';
  }
  
  // For today's hours, show them prominently
  const hoursString = todaysHours[0]; // e.g., "09:00-17:30"
  const [open, close] = hoursString.split('-');
  
  return `Open today: ${open} - ${close}`;
}

// Get full week opening hours summary
function getWeeklyHours(storeTimes) {
  if (!storeTimes) return 'Hours not available';
  
  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const groupedHours = [];
  let currentGroup = null;
  
  dayNames.forEach((day, index) => {
    const hours = storeTimes[day];
    const hoursString = hours && hours.length > 0 ? hours[0] : 'Closed';
    
    if (!currentGroup || currentGroup.hours !== hoursString) {
      // Start new group
      if (currentGroup) {
        groupedHours.push(currentGroup);
      }
      currentGroup = {
        days: [dayLabels[index]],
        hours: hoursString
      };
    } else {
      // Add to current group
      currentGroup.days.push(dayLabels[index]);
    }
  });
  
  // Add final group
  if (currentGroup) {
    groupedHours.push(currentGroup);
  }
  
  // Format groups
  return groupedHours.map(group => {
    const dayRange = group.days.length === 1 
      ? group.days[0]
      : group.days.length === 2
        ? group.days.join(' & ')
        : `${group.days[0]} - ${group.days[group.days.length - 1]}`;
    
    return `${dayRange}: ${group.hours === 'Closed' ? 'Closed' : group.hours.replace('-', ' - ')}`;
  }).join(' • ');
}

const clickCollectLocations = [
  {
    id: 'uk-london',
    name: 'London Office',
    address: '4th Floor 200 Grays Inn Road',
    city: 'London',
    country: 'United Kingdom',
    postcode: 'WC1X 8XZ',
    status: 'unavailable'
  },
  {
    id: 'spain-madrid',
    name: 'Madrid Office',
    address: 'Paseo Imperial, 14',
    city: 'Madrid',
    country: 'Spain',
    postcode: '28005',
    status: 'unavailable'
  },
  {
    id: 'poland-zielona',
    name: 'Zielona Góra Office',
    address: 'Kostrzyńska 4',
    city: 'Zielona Góra',
    country: 'Poland',
    postcode: '65-127',
    status: 'unavailable'
  },
  {
    id: 'us-austin',
    name: 'Austin Office',
    address: '4301 Bull Creek Rd',
    city: 'Austin, Texas',
    country: 'United States',
    postcode: '78731',
    status: 'unavailable'
  },
  {
    id: 'australia-sydney',
    name: 'Darlinghurst Office',
    address: '223 Liverpool Street',
    city: 'Darlinghurst, NSW',
    country: 'Australia',
    postcode: '2010',
    status: 'unavailable'
  }
];

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

  useEffect(() => {
  // Auto-populate collection postcode when main postcode is entered
  if (formData.post_code && formData.post_code.length >= 5) {
    setCollectionPostcode(formData.post_code);
  }
}, [formData.post_code]);


  //click and collect 
  const [showClickCollect, setShowClickCollect] = useState(false);
  const [selectedClickCollectLocation, setSelectedClickCollectLocation] = useState(null);
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
  const pudoListRef = useRef(null);
  // Loading
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
    fetchStandardDeliveryOptions();
    fetchNextDayOptions();
  }
}, [formData]);


  // Delivery sub-options 
  const [deliverySubOptions, setDeliverySubOptions] = useState ([
    { id: 'standard', title: 'Standard delivery', turnaround:"3 - 5 working days", price: '£5.95' },
    { id: 'next', title: 'Next day delivery', turnaround: "Delivered tomorrow", price: '£6.95' },
    { id: 'nominated', title: 'Nominated day', turnaround:"Choose a day that suits you", price: '£8.95' },
    // { id: 'timed', title: 'Timed delivery', turnaround:"AM or PM slot", price: '£10.95' }, hiding as not required for MVP
  ]);

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

    const shippingCost = selectedDeliverySubOption 
      ? parseFloat(selectedDeliverySubOption.price.replace('£', '')) 
      : 0;

    const vat = subtotal * 0.20;
    const total = subtotal + shippingCost;

    setOrderTotals({
      subtotal,
      shipping: shippingCost,
      vat,
      total
    });
  }, [cartItems, selectedDeliverySubOption]);

  

  const handleDeliveryMethodChange = (deliveryMethod) => {
    setSelectedDeliveryMethod(deliveryMethod);

    if (deliveryMethod.title === 'Delivery') {
      setShowDeliverySubOptions(true);
      setShowCollectionSearch(false); // Hide collection search
      setShowClickCollect(false); // Hide click & collect
      setSelectedClickCollectLocation(null); // Clear selected click & collect location
      setPudoOptions([]); // Clear PUDO options
      setSelectedPudoOption(null); // Clear selected PUDO option
      setCollectionPostcode(''); // Clear postcode input
    } else if (deliveryMethod.title === 'Local Collection Point') {
      setShowCollectionSearch(true); // Show collection search
      setShowDeliverySubOptions(false);
      setShowClickCollect(false); // Hide click & collect
      setSelectedClickCollectLocation(null); // Clear selected click & collect location
      setSelectedDeliverySubOption(null);
      setShowCalendar(false);
      setSelectedDate(null);
    } else if (deliveryMethod.title === 'Click & Collect') {
      setShowClickCollect(true);
      setShowDeliverySubOptions(false);
      setShowCollectionSearch(false);
      setSelectedDeliverySubOption(null);
      setShowCalendar(false);
      setSelectedDate(null);
      setPudoOptions([]);
      setSelectedPudoOption(null);
      setCollectionPostcode('');
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
      
    if (pudoData.results && pudoData.results.length > 0) {
  console.log('=== PUDO DATA STRUCTURE ANALYSIS ===');
  
  pudoData.results.forEach((pudo, index) => {
    console.log(`PUDO Option ${index + 1}:`, {
      storeName: pudo.storeName,
      address: pudo.address,
      postcode: pudo.postcode,
      // Look for price fields specifically:
      price: pudo.price,
      cost: pudo.cost,
      shippingCost: pudo.shippingCost,
      collectionCost: pudo.collectionCost,
      fee: pudo.fee,
      charges: pudo.charges,
      // Look for opening hours fields:
      storeTimes: pudo.storeTimes,
      // Show all available keys to see what fields exist:
      allKeys: Object.keys(pudo).filter(key => 
        key.toLowerCase().includes('price') || 
        key.toLowerCase().includes('cost') || 
        key.toLowerCase().includes('fee') ||
        key.toLowerCase().includes('charge')
      ),
      // Show full structure for first PUDO option only:
      ...(index === 0 ? { fullStructure: JSON.stringify(pudo, null, 2) } : {})
    });
  });
}

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
    // Fetch real nominated day options from your API
    fetchNominatedDays();
  } else if (subOption.id === 'standard') {
    fetchStandardDeliveryOptions();
    setShowCalendar(false);
    setSelectedDate(null);
  } else if (subOption.id === 'next') {
    fetchNextDayOptions(); // Add this line
    setShowCalendar(false);
    setSelectedDate(null);
  } else {
    setShowCalendar(false);
    setSelectedDate(null);
  }
};

  // Handle next day

  const fetchNextDayOptions = async () => {
  console.log('🔍 fetchNextDayOptions called!');
  
  try {
    const customerPostcode = formData.post_code || 'E20 2ST';
    
    console.log('Fetching next day delivery options for postcode:', customerPostcode);
    
    const response = await fetch(`/api/metapack/delivery-options?postcode=${encodeURIComponent(customerPostcode)}&type=next`);
    const data = await response.json();
    
    console.log('Next day delivery API response:', data);

    if (!data.nextDayOptions || data.nextDayOptions.length === 0) {
      console.log('No next day delivery options available');
      
      // Update to show not available
      setDeliverySubOptions(prevOptions => 
        prevOptions.map(option => {
          if (option.id === 'next') {
            return {
              ...option,
              turnaround: 'Not available for your location',
              price: 'N/A',
              disabled: false
            };
          }
          return option;
        })
      );
      return;
    }
    
    // Find the cheapest next day option (since all next day options deliver on the same day)
    const cheapestOption = data.nextDayOptions.reduce((prev, current) => {
      const prevCost = prev.shippingCost || 999;
      const currentCost = current.shippingCost || 999;
      return currentCost < prevCost ? current : prev;
    });

    console.log('Cheapest next day option:', cheapestOption);

    const deliveryDate = cheapestOption.to;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Update the delivery sub-options
    setDeliverySubOptions(prevOptions => 
      prevOptions.map(option => {
        if (option.id === 'next') {
          return {
            ...option,
            bookingCode: cheapestOption.carrierServiceCode,
            fullBookingCode: cheapestOption.bookingCode,
            price: `£${cheapestOption.shippingCost?.toFixed(2) || '6.95'}`,
            turnaround: deliveryDate 
              ? `Delivery by ${formatDeliveryDate(deliveryDate)}`
              : 'Next working day',
            carrierService: cheapestOption.fullName,
            deliveryWindow: cheapestOption.delivery,
            disabled: false
          };
        }
        return option;
      })
    );
    
  } catch (error) {
    console.error('Error fetching next day delivery options:', error);
  }
};

  const fetchNominatedDays = async () => {
  try {
    
    setIsLoadingDeliveryOptions(true);
    setIsDeliveryDataReady(false);
    // Use the customer's postcode from the form, fallback to default
    const customerPostcode = formData.post_code || 'E20 2ST';
    
    console.log('Fetching nominated days for postcode:', customerPostcode);
    
    const response = await fetch(`/api/metapack/delivery-options?postcode=${encodeURIComponent(customerPostcode)}`);
    const data = await response.json();
    
    console.log('Nominated days API response:', data);
    console.log('Available dates from API:', data.availableDates);
    
    if (data.availableDates && data.availableDates.length > 0) {
    console.log('Processing delivery windows:', data.availableDates);


      const calendarDates = getNext14Days(data.availableDates);
      setAvailableDates(calendarDates);
      console.log('Calendar dates with real data:', calendarDates);
    } else {
      console.log('No available dates from API, showing all dates as unavailable');
      // Show all dates as unavailable - pass empty array so all dates show as unavailable
      setAvailableDates(getNext14Days([]));
    }
   setIsDeliveryDataReady(true);
  } catch (error) {
    console.error('Error fetching nominated days:', error);
    setAvailableDates(getNext14Days([]));
  } finally {
    setIsLoadingDeliveryOptions(false);
  }
};

 // nominated day delivery options (14 days)
const getNext14Days = (deliveryWindows = []) => {
  console.log('getNext14Days called with deliveryWindows:', deliveryWindows);
  const days = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Find all delivery windows for this specific date
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const availableWindows = deliveryWindows.filter(window => {
      const fromDate = new Date(window.from);
      const toDate = new Date(window.to);
      const fromDateOnly = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
      const toDateOnly = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
      
      return dateOnly >= fromDateOnly && dateOnly <= toDateOnly;
    });

    const isAvailable = availableWindows.length > 0;

    days.push({
      date: date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString('en-US', { month: 'short' }),
      isAvailable: isAvailable,
      // Store ALL delivery windows for this date
      deliveryWindows: availableWindows,
      // Keep the first booking code for backward compatibility
      bookingCode: availableWindows.length > 0 ? availableWindows[0].bookingCode : null
    });
  }
  
  console.log('Final calendar days:', days);
  return days.slice(0, 14);
};

  const [availableDates, setAvailableDates] = useState([]);

  const handleDateSelection = (date) => {
    setSelectedDate(date);
  };

  

    useEffect(() => {
    async function fetchDeliveryOptions() {
      try {
        // Create static delivery options for the main selection
        const staticDeliveryOptions = [
          {
            id: 1,
            title: 'Delivery',
            turnaround: 'Various options available',
            bookingCode: 'DELIVERY_GENERAL',
            carrierServiceCode: 'STANDARD',
            deliveryWindow: null
          },
          {
            id: 2,
            title: 'Local Collection Point',
            turnaround: 'Collect when convenient',
            bookingCode: 'PUDO_GENERAL',
            carrierServiceCode: 'PUDO',
            deliveryWindow: null
          },
          {
          id: 3,
          title: 'Click & Collect',
          turnaround: 'Collect from our offices',
          bookingCode: 'CLICK_COLLECT_GENERAL',
          carrierServiceCode: 'CLICK_COLLECT',
          deliveryWindow: null
        }
        ];

        setDeliveryOptions(staticDeliveryOptions);
        
        // Set all dates as unavailable initially - real data will be fetched when user selects nominated day
        setAvailableDates(getNext14Days([])); // Empty array = all dates unavailable
        
      } catch (error) {
        console.error('Error setting up delivery options:', error);
        
        // Fallback to static options if anything fails
        const fallbackOptions = [
          {
            id: 1,
            title: 'Delivery',
            turnaround: 'Various options available',
            bookingCode: 'DELIVERY_GENERAL',
            carrierServiceCode: 'STANDARD',
            deliveryWindow: null
          },
          {
            id: 2,
            title: 'Local Collection Point',
            turnaround: 'Collect when convenient',
            bookingCode: 'PUDO_GENERAL',
            carrierServiceCode: 'PUDO',
            deliveryWindow: null
          }
        ];
        
        setDeliveryOptions(fallbackOptions);
        setAvailableDates(getNext14Days([])); // All dates unavailable on error too
      }
    }
    
    fetchDeliveryOptions();
  }, []);

  // Fetch Delivery Options

  // Format delivery date for display
function formatDeliveryDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  } catch (error) {
    console.error('Error formatting delivery date:', error);
    return null;
  }
}


const fetchStandardDeliveryOptions = async () => {
  try {
    const customerPostcode = formData.post_code || 'E20 2ST';
    
    console.log('Fetching standard delivery options for postcode:', customerPostcode);
    
    const response = await fetch(`/api/metapack/delivery-options?postcode=${encodeURIComponent(customerPostcode)}&type=standard`);
    const data = await response.json();
    
    console.log('Standard delivery API response:', data);

    console.log('Raw API response structure:', {
      hasStandardOptions: !!data.standardOptions,
      standardOptionsLength: data.standardOptions?.length || 0,
      firstOption: data.standardOptions?.[0] || 'No options'
    });

    if (!data.standardOptions || data.standardOptions.length === 0) {
      console.log('No standard delivery options available');
      return;
    }

    if (data.standardOptions && data.standardOptions.length > 0) {
      console.log('=== DELIVERY DATA EXTRACTION ===');
      
      data.standardOptions.forEach((option, index) => {
        console.log(`Option ${index + 1}:`, {
          carrierService: option.fullName,
          deliveryDateRange: {
            from: option.from,
            to: option.to,
            formatted: option.delivery?.to ? new Date(option.delivery.to).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }) : 'No date available'
          },
          cost: {
            raw: option.shippingCost,
            formatted: `£${option.shippingCost?.toFixed(2) || '0.00'}`
          },
          bookingCode: option.bookingCode
        });
      });
    
      // Find the fastest delivery option (earliest delivery date)
      const fastestOption = data.standardOptions.reduce((prev, current) => {
        const prevDate = new Date(prev.to || '2099-12-31');        // ✅ Use .to directly
        const currentDate = new Date(current.to || '2099-12-31');  // ✅ Use .to directly
        return currentDate < prevDate ? current : prev;
      });
      
      // Find the cheapest delivery option (lowest cost)
      const cheapestOption = data.standardOptions.reduce((prev, current) => {
        const prevCost = prev.shippingCost || 999;
        const currentCost = current.shippingCost || 999;
        return currentCost < prevCost ? current : prev;
      });

      console.log('Delivery options analysis:', {
        fastest: {
          service: fastestOption.fullName,
          deliveryDate: fastestOption.delivery?.to,
          cost: fastestOption.shippingCost
        },
        cheapest: {
          service: cheapestOption.fullName,
          deliveryDate: cheapestOption.delivery?.to,
          cost: cheapestOption.shippingCost
        }
      });

      // CONFIGURATION: Choose which option to use (easily switchable)
      const selectedOption = fastestOption;
      const optionType = 'fastest';

      console.log('🔍 DEBUG - selectedOption structure:', {
        fullSelectedOption: selectedOption,
        hasDelivery: !!selectedOption.delivery,
        deliveryObject: selectedOption.delivery,
        deliveryTo: selectedOption.delivery?.to,
        deliveryFrom: selectedOption.delivery?.from,
        // ADD THESE NEW LINES TO SEE THE FULL STRUCTURE:
        allKeys: Object.keys(selectedOption),
        fullStructure: JSON.stringify(selectedOption, null, 2)
});

      
      const deliveryDate = selectedOption.to;
      
      console.log('BEFORE UPDATE - About to update delivery sub-option:', {
        deliveryDate,
        formattedDate: formatDeliveryDate(deliveryDate),
        price: selectedOption.shippingCost?.toFixed(2) 
      });      

      setDeliverySubOptions(prevOptions => 
        prevOptions.map(option => {
          if (option.id === 'standard') {
            return {
              ...option,
              bookingCode: selectedOption.carrierServiceCode,
              fullBookingCode: selectedOption.bookingCode,
              price: `£${selectedOption.shippingCost?.toFixed(2) || '5.95'}`,
              turnaround: deliveryDate 
                ? `Delivery by ${formatDeliveryDate(deliveryDate)}`
                : '3 - 5 working days',
              carrierService: selectedOption.fullName,
              deliveryWindow: selectedOption.delivery,
              _fastestOption: fastestOption,
              _cheapestOption: cheapestOption
            };
          }
          return option;
        })
      );
      
      console.log(`Updated standard delivery with ${optionType} option:`, {
        service: selectedOption.fullName,
        deliveryDate: selectedOption.delivery?.to,
        formatted: formatDeliveryDate(selectedOption.delivery?.to),
        cost: selectedOption.shippingCost
      });
    } // ADD THIS CLOSING BRACE FOR THE INNER IF STATEMENT
    
  } catch (error) {
    console.error('Error fetching standard delivery options:', error);
  }
};

/* Function to switch between fastest/cheapest
const switchDeliveryOption = (optionType) => {
  setDeliverySubOptions(prevOptions => 
    prevOptions.map(option => {
      if (option.id === 'standard' && option._fastestOption && option._cheapestOption) {
        const selectedOption = optionType === 'fastest' ? option._fastestOption : option._cheapestOption;
        const deliveryDate = selectedOption.to;  // ✅ Use .to directly (not delivery.to)
        
        return {
          ...option,
          bookingCode: selectedOption.carrierServiceCode,
          fullBookingCode: selectedOption.bookingCode,
          price: `£${selectedOption.shippingCost?.toFixed(2) || '5.95'}`,
          turnaround: deliveryDate 
            ? `Delivery by ${formatDeliveryDate(deliveryDate)} (${optionType})`
            : '3 - 5 working days',
          carrierService: selectedOption.fullName,
          deliveryWindow: { from: selectedOption.from, to: selectedOption.to }  // ✅ Create delivery object
        };
      }
      return option;
    })
  );
};

// 🎯 FUTURE ENHANCEMENT: Create multiple standard options for user choice
// Uncomment this section if you want to show both fastest and cheapest as separate options
/*
const createMultipleStandardOptions = (fastestOption, cheapestOption) => {
  const standardOptions = [];
  
  // Add fastest option
  if (fastestOption) {
    const deliveryDate = fastestOption.delivery?.to;
    standardOptions.push({
      id: 'standard-fastest',
      title: 'Standard delivery (Fastest)',
      turnaround: deliveryDate 
        ? `Delivery by ${formatDeliveryDate(deliveryDate)}`
        : '3 - 5 working days',
      price: `£${fastestOption.shippingCost?.toFixed(2) || '5.95'}`,
      bookingCode: fastestOption.carrierServiceCode,
      fullBookingCode: fastestOption.bookingCode,
      carrierService: fastestOption.fullName,
      deliveryWindow: fastestOption.delivery,
      optionType: 'fastest'
    });
  }
  
  // Add cheapest option (if different from fastest)
  if (cheapestOption && cheapestOption.bookingCode !== fastestOption?.bookingCode) {
    const deliveryDate = cheapestOption.delivery?.to;
    standardOptions.push({
      id: 'standard-cheapest',
      title: 'Standard delivery (Cheapest)',
      turnaround: deliveryDate 
        ? `Delivery by ${formatDeliveryDate(deliveryDate)}`
        : '3 - 5 working days',
      price: `£${cheapestOption.shippingCost?.toFixed(2) || '5.95'}`,
      bookingCode: cheapestOption.carrierServiceCode,
      fullBookingCode: cheapestOption.bookingCode,
      carrierService: cheapestOption.fullName,
      deliveryWindow: cheapestOption.delivery,
      optionType: 'cheapest'
    });
  }
  
  return standardOptions;
};
*/

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
  

useEffect(() => {
  // When postcode changes, fetch delivery options for both standard and nominated
  if (formData.post_code && formData.post_code.length >= 5) {
    console.log('Postcode changed, fetching delivery options for:', formData.post_code);
    
    // Fetch standard delivery options
    fetchStandardDeliveryOptions();
    
    // If nominated day is selected, also refresh nominated options
    if (selectedDeliverySubOption?.id === 'nominated') {
      fetchNominatedDays();
    }
  }
}, [formData.post_code, selectedDeliverySubOption]);


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
    // Check if delivery data is still loading
  if (isLoadingDeliveryOptions) {
    console.log('Please wait, delivery options are still loading...');
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

                <div className="sm:col-span-2">
                  <label htmlFor="house_apartment_number" className="block text-sm/6 font-medium text-gray-700">
                    Apartment, suite
                  </label>
                  <div className="mt-2">
                    <input
                      id="house_apartment_number"
                      name="house_apartment_number"
                      type="text"
                      value={formData.house_apartment_number}
                      onChange={handleChange}
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
                        className="size-5 text-[#303efaff] group-not-data-checked:hidden"
                      />
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
{/* Consent Checkboxes */}
  <div className="space-y-4 mb-6">
    {/* Marketing Consent */}
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id="marketing-consent"
          name="marketing-consent"
          type="checkbox"
          checked={consentCheckboxes.marketing}
          onChange={() => handleConsentChange('marketing')}
          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black focus:ring-2"
        />
      </div>
      <div className="ml-3">
        <label htmlFor="marketing-consent" className="text-sm text-gray-700">
          I agree that Auctane Limited may use my personal data for marketing purposes, as described in the{' '}
          <a 
            href="/privacy-policy" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline hover:text-gray-700"
          >
            Privacy Policy
          </a>
          .
        </label>
        <p className="text-xs text-gray-500 mt-1">
          You can withdraw your consent at any time by contacting us at{' '}
          <a 
            href="mailto:dataprotection@metapack.com" 
            className="text-black underline hover:text-gray-700"
          >
            dataprotection@metapack.com
          </a>
          {' '}or by following the unsubscribe link in our emails.
        </p>
      </div>
    </div>

    {/* Privacy Policy Consent */}
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id="privacy-policy-consent"
          name="privacy-policy-consent"
          type="checkbox"
          checked={consentCheckboxes.privacyPolicy}
          onChange={() => handleConsentChange('privacyPolicy')}
          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black focus:ring-2"
        />
      </div>
      <div className="ml-3">
        <label htmlFor="privacy-policy-consent" className="text-sm text-gray-700">
          I have read and accept the{' '}
          <a 
            href="/privacy-policy" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline hover:text-gray-700"
          >
            Privacy Policy
          </a>
          , which explains how my personal data will be used and my rights under data protection law.
        </label>
      </div>
    </div>
  </div>

                  <button
                    type="submit"
                    disabled={
                      isLoadingDeliveryOptions || 
                      !consentCheckboxes.marketing || 
                      !consentCheckboxes.privacyPolicy ||
                      showClickCollect ||
                      isSubmittingOrder
                    }
                    className={`w-full rounded-md border border-transparent ${
                      isLoadingDeliveryOptions || !consentCheckboxes.marketing || !consentCheckboxes.privacyPolicy || showClickCollect || isSubmittingOrder
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-black hover:bg-white hover:text-black hover:border-black'
                    } px-4 py-3 text-base font-medium text-white shadow-xs  focus:ring-black focus:ring-1 focus:ring-offset-0 focus:outline-hidden`}
                  >
                    {isSubmittingOrder 
                      ? 'Processing order...'           // When submitting the order
                      : isLoadingDeliveryOptions        // When loading delivery data  
                        ? 'Loading delivery options...' 
                        : !consentCheckboxes.marketing || !consentCheckboxes.privacyPolicy
                          ? 'Please accept privacy policy to continue'
                          : showClickCollect
                            ? 'Click & Collect coming soon - choose another option'
                            : 'Confirm order'
                    }
                  </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}