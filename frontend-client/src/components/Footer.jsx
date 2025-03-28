import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const descriptionCompany = [
    {
      title: "Freight Forwarding",
      content: "Planning and managing the movement of goods.",
    },
    {
      title: "Transportation",
      content: "Moving goods from one place to another.",
    },
    {
      title: "Warehousing",
      content: "Storing goods safely.",
    },
  ];

  const address = `Room 5, 7th floor, Thanh Dat Building, No.3 Le Thanh Tong str, Ngo Quyen dist, Hai Phong city, Vietnam`;

  const services = [
    "OCEAN FREIGHT",
    "AIR FREIGHT",
    "FREIGHT MANAGEMENT SOFTWARE",
    "CONTAINER SERVICES",
    "WAREHOUSING",
    "END TO END SOLUTIONS",
    "CUSTOMS CLEARANCE",
    "MULTI-TRANSPORT",
  ];

  const phone_number = "(+84)2253 652 256";

  const email = "info@ttplogistics.vn";

  return (
    <footer className="bg-blue-900 rounded-lg shadow-sm dark:bg-gray-900 m-4 text-white">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 grid lg:grid-cols-3 gap-3 items-start justify-between">
        {/* col-1 */}
        <div className="flex flex-col justify-start">
          <p className="text-start">
            <a
              href="#"
              className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
                T.T.P Logistics
              </span>
            </a>
          </p>
          <div className="border w-12 border-3"></div>
          <p className="font-semibold my-2">
            T.T.P Logistics: Your Reliable Shipping Partner
          </p>
          <p className="my-2">
            Established in 2010, TTP Logistics is a company that helps
            businesses with all their shipping needs. They handle services like:
          </p>
          <ul className="list-disc px-4">
            {descriptionCompany &&
              descriptionCompany.map((item, index) => (
                <li className="my-2" key={index}>
                  <span className="font-bold">{item.title}: </span>{" "}
                  {item.content}
                </li>
              ))}
          </ul>
        </div>
        {/* col-2 */}
        <div className="flex flex-col justify-start">
          <p className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
              Service
            </span>
          </p>
          <div className="border w-12 border-3"></div>
          <ul className="list-disc px-4">
            {services &&
              services.map((item, index) => (
                <li className="my-2" key={index}>
                  {item}
                </li>
              ))}
          </ul>
        </div>
        {/* col-3 */}
        <div className="flex flex-col justify-start">
          <p className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
              Contact us
            </span>
          </p>
          <div className="border w-12 border-3"></div>
          <div className="flex items-start">
            {/* map pin icon */}
            <MapPinIcon className="size-20 lg:size-10 mr-2" />{" "}
            <span className="pt-2">{address}</span>
          </div>
          <div className="flex my-2">
            <PhoneIcon className="size-5 mr-2" /> {phone_number}
          </div>
          <div className="flex my-2">
            <EnvelopeIcon className="size-5 mr-2" /> {email}
          </div>
        </div>
        {/* end col */}
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="pb-5 text-center">
        <span className="block text-sm text-white sm:text-center dark:text-gray-400">
          © {currentYear}{" "}
          <a href="#" className="hover:underline">
            TTP Logistics
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
