// /app/api/metapack/generate-shipping-label/route.js

export async function POST(req) {
  try {
    const body = await req.json();

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
      bookingCode
    } = body;

    const countryMap = {
        "United Kingdom": "GBR",
        };

    const parcelItems = items_details
  ? items_details.map(item => ({
      itemRef: item.itemRef,
      description: item.description,
      quantity: item.quantity || 1,
      countryOfOrigin: "GBR"
    }))
  : [{
      itemRef: "item-001",
      description: item_ordered,
      quantity: 1,
      countryOfOrigin: "GBR"
    }];


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
            items: [
            {
            itemRef: "item-001",
            description: "Focus Card",
            quantity: 1,
            countryOfOrigin: "GBR"
            },
        ]
    }        
],    
          
        type: "delivery"
        },
            shippingRules: {
            carrierServices: [bookingCode]
        },
      paperwork: {
        format: "zpl",
        dimension: "6x4",
        type: "all"
      }
    };

    console.log('Auth header being sent:', process.env.METAPACK_SAPI_BASIC_AUTH);

    const response = await fetch("https://api.sbx.metapack.com/shipping/v1/consignment-with-paperwork", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.METAPACK_SAPI_BASIC_AUTH
      },
      body: JSON.stringify(consignmentPayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Metapack error:", errorData);
      return new Response(JSON.stringify({ error: "Failed to generate label", details: errorData }), {
        status: 500
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), {
      status: 500
    });
  }
}