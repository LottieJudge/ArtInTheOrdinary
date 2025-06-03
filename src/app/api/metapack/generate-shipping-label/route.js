// /app/api/metapack/generate-shipping-label/route.js

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Production debug - Request body received:', JSON.stringify(body, null, 2));

    const {
      first_name,
      last_name,
      email_address,
      phone_number,
      company_name,
      firstLine_address,
      house_apartment_number,
      city,
      state_province,
      post_code,
      country,
      item_ordered,
      items_details,
      cartItems,
      bookingCode
    } = body;

    console.log('Production debug - Booking code extracted:', bookingCode);
    console.log('Production debug - Cart items received:', cartItems);


    const countryMap = {
        "United Kingdom": "GBR",
        "France": "FRA",
        "Germany": "DEU",
        "Italy": "ITA",
        "Spain": "ESP",
        "Netherlands": "NLD"
        };
  // had to add in as the booking code was stopping supabase working with the metapack apis - too many api's 
     if (!bookingCode || typeof bookingCode !== 'string') {
        throw new Error(`bookingCode is missing or not a string: ${bookingCode}`);
       }
    
    const carrierServiceCode = bookingCode.includes('/')
      ? bookingCode.split('/')[0]
      : bookingCode;

      console.log('Production debug - Carrier service code:', carrierServiceCode);

        const parcelItems = cartItems && cartItems.length > 0
      ? cartItems.map((item, index) => {
          // Truncate description to max 50 characters (adjust as needed)
          const maxLength = 50;
          let description = item.description || item.name || 'Product';
          
          if (description.length > maxLength) {
            description = description.substring(0, maxLength - 3) + '...';
          }
          
          return {
            itemRef: `item-${String(index + 1).padStart(3, '0')}`,
            description: description,
            quantity: item.quantity || 1,
            countryOfOrigin: "GBR"
          };
        })
      : [{
          itemRef: "item-001",
          description: item_ordered || 'Product',
          quantity: 1,
          countryOfOrigin: "GBR"
        }];

    console.log('Production debug - Parcel items:', JSON.stringify(parcelItems, null, 2));

    const consignmentPayload = {
      consignment: {
        manifestGroupCode: `MAISON_${new Date().toISOString().split('T')[0]}`,
        orders: [
          {
            orderRef: `MAISON-${Date.now()}`
          }
        ],
        sender: {
                code: "DELTA_Maison",
                addressLine1: "70 Gracechurch Street",
                addressLine2: "Suite 322",
                postCode: "EC3V 0HR",
                countryCode: "GBR",
                companyName: "Maison - Metapack",
                city: "London",
                contact: {
                name: "Sodiq A",
                email: "Info@METAPACK.com",
                phone: "777 777 777"
                }
            },
        recipient: {
          addressLine1: firstLine_address,
          addressLine2: house_apartment_number,
          postCode: post_code,
          countryCode: countryMap[country] || "GBR",
          companyName: company_name,
          city: city,
          stateProvince: state_province,
          contact: {
            name: `${first_name} ${last_name}`,
            email: email_address,
            phone: phone_number
          }
        },
        parcels: [
          {
            packagingType: "BOX",
            weight: {
              value: 1.2,
            },
            dimensions: {
              height: 20,
              width: 22,
              depth: 15
            },
            value: {
            amount: 20,
            currencyCode: "GBP"
            },
            
            items: parcelItems,
    }        
],    
          
        type: "delivery"
        },
            shippingRules: {
            carrierServices: [carrierServiceCode]
        },
      paperwork: {
        format: "zpl",
        dimension: "6x4",
        type: "all"
      }
    };

    console.log('Production debug - Full payload being sent:', JSON.stringify(consignmentPayload, null, 2));
    console.log('Production debug - Auth header:', process.env.METAPACK_SAPI_BASIC_AUTH ? 'Present' : 'Missing');
    console.log('Production debug - API URL:', "https://api.sbx.metapack.com/shipping/v1/consignment-with-paperwork");

    const response = await fetch("https://api.sbx.metapack.com/shipping/v1/consignment-with-paperwork", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.METAPACK_SAPI_BASIC_AUTH
      },
      body: JSON.stringify(consignmentPayload)
    });

    console.log('Production debug - Response status:', response.status);
    console.log('Production debug - Response headers:', Object.fromEntries(response.headers.entries()));


    const data = await response.json();
    console.log('Production debug - Success response:', JSON.stringify(data, null, 2));
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Production debug - Unexpected error:', error);
    console.error('Production debug - Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      error: "Unexpected server error",
      details: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}