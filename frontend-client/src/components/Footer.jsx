const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white rounded-lg shadow-sm dark:bg-gray-900 m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 grid lg:grid-cols-3 gap-3 justify-between">
        {/* col-1 */}
        <div className="sm:flex sm:items-center sm:justify-between flex flex-col">
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
          <p className="font-semibold">T.T.P Logistics: Your Reliable Shipping Partner</p>
        </div>
        {/* col-2 */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <p className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
              Service
            </span>
          </p>
        </div>
        {/* col-3 */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <p className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
              Contact us
            </span>
          </p>
        </div>
        {/* end col */}
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
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
