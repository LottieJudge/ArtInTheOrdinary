export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const long = searchParams.get('long');
  
  console.log('PUDO API called with coordinates:', { lat, long });
  
  try {
    let url = 'https://dmo.metapack.com/dmoptions/find';
    const params = new URLSearchParams({
      key: process.env.METAPACK_DDO_KEY,
      wh_code: 'DELTA_Maison',
      optionType: 'PUDO',
      r_t: 'lsc',
      // Add parameters to get multiple results
      limit: '20',                    // Limit to 20 results
      radius: '5000',                 // 5km radius in meters
      sort: 'distance',               // Sort by distance
      includeDistance: 'true',        // Include distance in response
      maxDistance: '10000'            // Maximum distance 10km
    });

    // If coordinates are provided, use them for location-based search
    if (lat && long) {
      params.append('c_lat', lat);
      params.append('c_long', long);
    }

    console.log('Metapack API request URL:', `${url}?${params.toString()}`);

    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    console.log('Raw Metapack PUDO response sample:');
if (data.results && data.results.length > 0) {
  console.log('First PUDO result structure:', {
    keys: Object.keys(data.results[0]),
    sampleData: data.results[0]
  });
  
  // Look specifically for opening hours fields
  const firstPudo = data.results[0];
  console.log('Opening hours fields check:', {
    storeTimes: firstPudo.storeTimes,
    openingHours: firstPudo.openingHours,
    operatingHours: firstPudo.operatingHours,
    hours: firstPudo.hours,
    workingHours: firstPudo.workingHours
  });
}

    if (data.results && Array.isArray(data.results)) {
      const uniqueResults = data.results.filter((pudo, index, self) => 
        index === self.findIndex(p => 
          p.storeName === pudo.storeName && 
          p.address === pudo.address &&
          p.postcode === pudo.postcode
        )
      );
      
      console.log('After deduplication:', uniqueResults.length);
      console.log('Removed duplicates:', data.results.length - uniqueResults.length);
      
      data.results = uniqueResults;
    }
    
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching PUDO options:', error);
    return Response.json({ 
      error: 'Failed to fetch PUDO options',
      results: [] 
    });
  }
};