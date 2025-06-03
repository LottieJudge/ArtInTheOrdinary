const countryMap = {
    "United Kingdom": "GBR",
    "France": "FRA",
    "Germany": "DEU",
    "Italy": "ITA",
    "Spain": "ESP",
    "Netherlands": "NLD",
    "GB": "GBR",
    "FR": "FRA",
    "DE": "DEU",
    "IT": "ITA",
    "ES": "ESP",
    "NL": "NLD"
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postcode = searchParams.get('postcode') || 'E20 2ST';
    const inputCountry = searchParams.get('country') || 'United Kingdom';
    const country = countryMap[inputCountry] || 'GBR';
    const deliveryType = searchParams.get('type') || 'both';
    const warehousePostcode = 'EC3V 0HR';

    console.log('=== DELIVERY OPTIONS API DEBUG ===');
    console.log('Input parameters:', {
      postcode,
      inputCountry,
      mappedCountry: country,
      deliveryType
    });


    // 14 day delivery slots
    const deliverySlots = getNext14Days();
    console.log('Generated delivery slots:', deliverySlots);


    const url = new URL('https://dmo.metapack.com/dmoptions/find');
    url.searchParams.set('key', process.env.METAPACK_DDO_KEY);
    url.searchParams.set('wh_code', 'DELTA_Maison');
    url.searchParams.set('wh_pc', warehousePostcode);
    url.searchParams.set('wh_cc', 'GBR');
    url.searchParams.set('c_pc', postcode);
    url.searchParams.set('c_cc', country);
    url.searchParams.set('radius', '1000');
    url.searchParams.set('optionType', 'HOME');

    // Set delivery-specific params based on type
    if (deliveryType === 'standard') {
      url.searchParams.set('incgrp', 'STANDARD');
      url.searchParams.set('r_t', 'ggg');
    } else if (deliveryType === 'nominated') {
      url.searchParams.set('incgrp', 'NOMINATED');
      url.searchParams.set('r_t', 'ggg');
      url.searchParams.set('acceptableDeliverySlots', deliverySlots.join(','));
    } else if (deliveryType === 'next') {
      url.searchParams.set('incgrp', 'NEXTDAY');
      url.searchParams.set('r_t', 'ggg');
    } else {
      // Both or All
      url.searchParams.set('incgrp', 'STANDARD,NEXT,NOMINATED');
      url.searchParams.set('r_t', 'ggg');
      url.searchParams.set('acceptableDeliverySlots', deliverySlots.join(','));
    }



    console.log('Metapack URL:', url.toString());
    
    const response = await fetch(url.toString());
    const data = await response.json();

    console.log('Metapack response status:', response.status);
    console.log('Metapack response data:', data)

     // Check if the response has an error
    if (data.errorCode) {
      console.warn('Metapack API error:', data);
      // Return empty array but don't throw error - let frontend handle gracefully
      return Response.json({ 
        availableDates: [],
        requestedDates: deliverySlots,
        error: data.message || 'No delivery options available for this postcode'
      });
    }
    
    // Extract just the available delivery windows from the response
   const deliveryOptions = data.results
  ? data.results
      .filter(option => {
        console.log('Processing option:', {
          bookingCode: option.bookingCode,
          groupCodes: option.groupCodes,
          delivery: option.delivery,
          optionType: option.optionType
        });
        
        return option.optionType === 'HOME';
      })
      .map(option => {
        // MOVE THE DEBUG LOGGING HERE - INSIDE THE MAP FUNCTION
        console.log('📅 Date processing debug:', {
          originalDeliveryFrom: option.delivery.from,
          originalDeliveryTo: option.delivery.to,
          parsedFromDate: new Date(option.delivery.from),
          parsedToDate: new Date(option.delivery.to),
          bookingCode: option.bookingCode,
          groupCode: option.groupCodes[0]
        });

        return {
          from: option.delivery?.from,
          to: option.delivery?.to,
          bookingCode: option.bookingCode,
          carrierServiceCode: option.carrierServiceCode,
          fullName: option.fullName,
          groupCodes: option.groupCodes,
          shippingCost: option.shippingCost
        };
      })
  : [];


  
    console.log(`Found ${deliveryOptions.length} available delivery windows`);

     // Separate standard and nominated options
    const standardOptions = deliveryOptions.filter(option => 
      option.groupCodes?.includes('STANDARD')
    );
    
    const nominatedOptions = deliveryOptions.filter(option => 
      option.groupCodes?.includes('NOMINATED')
    );

    const nextDayOptions = deliveryOptions.filter(option => 
      option.groupCodes?.includes('NEXTDAY')
    );


    return Response.json({ 
      standardOptions: standardOptions,
      nominatedOptions: nominatedOptions,
      nextDayOptions: nextDayOptions, // Add this new field
      availableDates: nominatedOptions, // Keep this for backward compatibility
      requestedDates: deliverySlots,
      postcode: postcode
    });
    
  } catch (error) {
    console.error('Failed to fetch nominated days:', error);
    return Response.json(
      { error: 'Failed to fetch nominated days' }, 
      { status: 500 }
    );
  }
}

function getNext14Days() {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}