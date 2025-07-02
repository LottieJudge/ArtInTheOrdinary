import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Link,
  Img,
} from '@react-email/components';


export const OrderConfirmationEmail = ({
  firstName,
  orderDetails,
  shipping
}) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return Number(price.replace('£', '')).toFixed(2);
    }
    return Number(price).toFixed(2);
  };

  return (
    <Html>
      <Head />
      <Preview>Your Art In The Ordinary order confirmation</Preview>
      <Body style={main}>
        <Container style={headerContainer}>
          <Img
            src='REPLACE WITH AITO LOGO'
            alt="Art In The Ordinary Logo"
            width="180"
            style={logo}
          />
          <Text style={tagline}>
            
          </Text>
        </Container>

        <Container style={container}>
          <Heading style={heading}>Your order has been confirmed.</Heading>
          <Text style={text}>
            Dear {firstName},
            <br /><br />
            Thank you for your order. Your items are now being prepared for despatch. 
            You will receive tracking details once your order ships.
          </Text>

          <Heading as="h3" style={subheading}>Order Summary</Heading>
          <Text style={orderDetails}>
            <strong>Order Number:</strong> {orderDetails.orderNumber}<br />
            <strong>Order Date:</strong> {formattedDate}<br /><br />
            <strong>Shipping To:</strong><br />
            {shipping.name}<br />
            {shipping.address}<br />
            {shipping.city}<br />
            {shipping.postcode}<br /><br />
            <strong>Items:</strong><br />
            {orderDetails.items.map((item, index) => (
                <Text key={index} style={{ margin: 0 }}>
                  {item.name} – £{formatPrice(item.price)}
                </Text>
              ))}
            <strong>Subtotal:</strong> £{formatPrice(orderDetails.totals.subtotal)}<br />
            <strong>Shipping:</strong> £{formatPrice(orderDetails.totals.shipping)}<br />
            <strong>Total:</strong> <strong>£{formatPrice(orderDetails.totals.total)}</strong>
          </Text>

          <Container style={valueProp}>
            <Text style={valuePropText}>
                REPLACE WITH AITO STUFF 
              <br /><br />
              <br /><br />
      
            </Text>
          </Container>

          <Container style={resources}>
            <Text style={resourcesHeading}></Text>
            <ul style={resourcesList}>
              <li>
                <Link style={link} href="">
                  Learn More
                </Link>
              </li>
              <li>
                <Link style={link} href="">
                  Contact Us
                </Link>
              </li>
            </ul>
          </Container>
        </Container>
        
        <Container style={footer}>
          <Img
            src="g"
            alt="aiTO Logo"
            width="140"
            style={footerLogo}
          />
          <br></br>
          <br></br>
   
          <Text>
            <strong>Opting Out:</strong>
            <br></br>
            You can ask us or third parties to stop sending you marketing messages at any time by following the opt-out links on any marketing message sent to you or by contacting us at <Link style={link} href="">AITO EMAIL HERE</Link> at any time.
          </Text>
          <br></br>
          <br></br>
          <Text style={copyright}>
            © {today.getFullYear()} Art In The Ordinary. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Georgia, serif',
};

const headerContainer = {
  textAlign: 'center',
  padding: '40px 20px 10px',
};

const logo = {
  display: 'block',
  margin: '0 auto',
};

const tagline = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  fontWeight: '300',
  color: '#333',
  marginTop: '8px',
  letterSpacing: '1px',
};

const container = {
  padding: '20px',
  maxWidth: '600px',
  margin: 'auto',
};

const heading = {
  fontWeight: 'normal',
  fontSize: '24px',
  margin: '0 0 24px',
};

const subheading = {
  marginTop: '40px',
  fontSize: '20px',
  fontWeight: 'normal',
};

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const orderDetails = {
  fontSize: '15px',
  lineHeight: '1.6',
};

const valueProp = {
  marginTop: '50px',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderLeft: '3px solid #000',
};

const valuePropText = {
  fontSize: '15px',
  fontFamily: 'Arial, sans-serif',
  color: '#333',
};

const resources = {
  marginTop: '30px',
  fontFamily: 'Arial, sans-serif',
};

const resourcesHeading = {
  fontSize: '16px',
  fontWeight: 'bold',
};

const resourcesList = {
  paddingLeft: '20px',
  fontSize: '14px',
  color: '#000',
};

const link = {
  color: 'blue',  
};

const footer = {
  textAlign: 'left',
  fontSize: '12px',
  padding: '40px 0 20px',
};

const footerLogo = {
  opacity: '0.7',
  display: 'block',
  margin: '0 auto'
};

const copyright = {
  textAlign: 'centre',
  fontSize: '12px',
  color: '#888',
  fontFamily: 'Arial, sans-serif',
};

export default OrderConfirmationEmail;