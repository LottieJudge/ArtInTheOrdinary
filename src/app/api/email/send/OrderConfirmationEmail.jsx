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
      <Preview>Your Maison Metapack order confirmation</Preview>
      <Body style={main}>
        <Container style={headerContainer}>
          <Img
            src="https://maisonmetapack.com/images/metapackLogo.png"
            alt="Metapack Logo"
            width="180"
            style={logo}
          />
          <Text style={tagline}>
            The home of delivery
          </Text>
        </Container>

        <Container style={container}>
          <Heading style={heading}>Your order has been confirmed.</Heading>
          <Text style={text}>
            Dear {firstName},
            <br /><br />
            Thank you for your order. Your items are now being prepared for dispatch. 
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
              This experience is powered by <strong>Metapack</strong> – the enterprise-grade 
              delivery management platform used by the world's leading brands.
              <br /><br />
              From intelligent checkout delivery options to real-time tracking and post-purchase 
              insights, Metapack helps ensure every order arrives exactly how and when it should.
              <br /><br />
              <strong>Performance, reliability, and scale.</strong><br />
              Over 1 billion parcels shipped annually, supported by 350+ global carriers, 
              99% platform uptime, and decades of delivery expertise.
            </Text>
          </Container>

          <Container style={resources}>
            <Text style={resourcesHeading}>Explore More:</Text>
            <ul style={resourcesList}>
              <li>
                <Link style={link} href="https://auctane.share.mindtickle.com/room/9d3452c8-c96f-48c9-9f2b-509af52b5bb8">
                  Metapack Resources & Case Studies
                </Link>
              </li>
              <li>
                <Link style={link} href="https://help.metapack.com/hc/en-gb">
                  How Our Technology Works
                </Link>
              </li>
              <li>
                <Link style={link} href="https://dev.metapack.com/">
                  Developer Docs
                </Link>
              </li>
              <li>
                <Link style={link} href="https://www.metapack.com/form">
                  Contact Metapack
                </Link>
              </li>
            </ul>
          </Container>
        </Container>
        
        <Container style={footer}>
          <Img
            src="https://maisonmetapack.com/images/metapackLogo.png"
            alt="Metapack Logo"
            width="140"
            style={footerLogo}
          />
          <Text style={copyright}>
            © {today.getFullYear()} Metapack. All rights reserved.
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
  color: '#000',
  textDecoration: 'none',
};

const footer = {
  textAlign: 'center',
  padding: '40px 0 20px',
};

const footerLogo = {
  opacity: '0.7',
};

const copyright = {
  fontSize: '12px',
  color: '#888',
  fontFamily: 'Arial, sans-serif',
};

export default OrderConfirmationEmail;