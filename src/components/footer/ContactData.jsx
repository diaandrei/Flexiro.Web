import PaypalLogo from "../images/PaypalLogo.png";
import VisaCardLogo from "../images/visalogo.png";
import MasterCardLogo from "../images/MasterCardLogo.png";

const contactData = {
  paymentMethods: [
    {
      src: MasterCardLogo,
      alt: "Mastercard",
      url: "https://www.mastercard.com",
    },
    { src: PaypalLogo, alt: "PayPal", url: "https://www.paypal.com" },
    { src: VisaCardLogo, alt: "Visa", url: "https://www.visa.com" },
  ],
  socialMediaLinks: [
    { platform: "instagram", url: "https://www.instagram.com" },
    { platform: "twitter", url: "https://www.twitter.com" },
    { platform: "facebook", url: "https://www.facebook.com" },
  ],
};

export default contactData;
