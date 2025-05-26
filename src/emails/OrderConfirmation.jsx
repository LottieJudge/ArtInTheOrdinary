import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

export const OrderConfirmation = ({
    firstName,
    orderDetails
  }) => (
    <Html>
      <Head />
      <Preview>Your Maison Metapack order confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your order, {firstName}!</Heading>
          <Text style={text}>
            We've received your order and will begin processing it right away.
          </Text>
        </Container>
      </Body>
    </Html>
  );

  const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };

  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
  };

  const h1 = {
    color: '#1f2937',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '32px',
    margin: '0 0 24px',
  };

  const text = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 16px',
  };