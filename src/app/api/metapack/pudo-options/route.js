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
    
    console.log('Metapack API response:', JSON.stringify(data, null, 2));
    console.log('Number of results returned:', data.results ? data.results.length : 0);
    
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching PUDO options:', error);
    return Response.json({ 
      error: 'Failed to fetch PUDO options',
      results: [] 
    });
  }
};