const CardNews = ({ title, description }) => {
  return (
    <>
      <div className="flex bg-white-100">
        {/* Calendar */}
        <div className="calendar">
          <h1 className="bg-gray-200 text-2xl font-bold px-7 py-4">01</h1>
          <h2 className="bg-sky-800 text-white font-bold text-lg px-7">Mar</h2>
        </div>
        {/* Info */}
        <div className="text-start px-5">
          {/* title */}
          <h1 className="font-bold">{title}</h1>
          {/* description */}
          <p className="text-gray-500 mt-2">{description}</p>
          <button type="button" className="cursor-pointer mt-5 text-sky-800 hover:text-blue-300 font-bold">Read more &rarr;</button>
        </div>
      </div>
    </>
  );
};

export default CardNews;
