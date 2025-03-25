import React from "react";
import CardNews from "../../components/CardNews";

const SectionThree = () => {
  const news = [
    {
      id: 1,
      title: "PORT OF ROTTERDAM TO IMPLEMENT PORTXCHANGE...",
      description:
        "(“PortXchange” or the “Company”) PortXchange Products B.V., the Netherlands-based digital solutions provider for predictable and sustainable...",
    },
    {
      id: 2,
      title: "PORT OF ROTTERDAM TO IMPLEMENT PORTXCHANGE...",
      description:
        "(“PortXchange” or the “Company”) PortXchange Products B.V., the Netherlands-based digital solutions provider for predictable and sustainable...",
    },
    {
      id: 3,
      title: "PORT OF ROTTERDAM TO IMPLEMENT PORTXCHANGE...",
      description:
        "(“PortXchange” or the “Company”) PortXchange Products B.V., the Netherlands-based digital solutions provider for predictable and sustainable...",
    },
  ];
  return (
    <>
      <div className="mb-6 bg-gray-200 p-10">
        <h1 className="font-bold text-3xl">News</h1>
        <p className="text-gray">
          <span className="border-b-5 border-blue-500 uppercase">
            Logistics News
          </span>
        </p>
      </div>
      <div className="grid justify-center lg:grid-cols-3 gap-6">
        {/* {<CardNews />} */}
        {news &&
          news.map((item, index) => (
            <CardNews
              key={index}
              title={item.title}
              description={item.description}
            />
          ))}
      </div>
    </>
  );
};

export default SectionThree;
