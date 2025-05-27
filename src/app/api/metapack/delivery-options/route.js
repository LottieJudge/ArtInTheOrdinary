export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postcode = searchParams.get('postcode') || 'E20 2ST';
    const warehousePostcode = 'EC3V 0HR';
    
    // Generate next 14 days for query
    const deliverySlots = getNext14Days();

    const url = new URL('https://dmo.metapack.com/dmoptions/find');
    url.searchParams.set('key', process.env.METAPACK_DMO_KEY);
    url.searchParams.set('wh_code', 'DELTA_Maison');
    url.searchParams.set('wh_pc', warehousePostcode);
    url.searchParams.set('wh_cc', 'GBR');
    url.searchParams.set('c_pc', postcode);
    url.searchParams.set('c_cc', 'GBR');
    url.searchParams.set('radius', '1000');
    url.searchParams.set('r_t', 'lsc');
    url.searchParams.set('optionType', 'HOME');
    url.searchParams.set('incgrp', 'Nominated');
    url.searchParams.set('acceptableDeliverySlots', deliverySlots.join(','));

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
    const availableDeliveryWindows = data.results
      ? data.results
          .filter(option => {
            console.log('Processing option:', {
              bookingCode: option.bookingCode,
              groupCodes: option.groupCodes,
              delivery: option.delivery
            });
            
            // Check if this is a valid delivery option with dates
            return option.delivery && 
                   option.delivery.from && 
                   option.delivery.to &&
                   option.optionType === 'HOME';
          })
          .map(option => ({
            from: option.delivery.from,
            to: option.delivery.to,
            bookingCode: option.bookingCode,
            carrierServiceCode: option.carrierServiceCode,
            fullName: option.fullName
          }))
      : [];

    console.log(`Found ${availableDeliveryWindows.length} available delivery windows`);

    return Response.json({ 
      availableDates: availableDeliveryWindows,
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