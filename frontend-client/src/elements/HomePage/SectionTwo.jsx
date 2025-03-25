import React from "react";
import Card from "../../components/Card";

const SectionTwo = () => {
  const services = [
    // 1
    {
      id: 1,
      img: "https://ttplogistics.vn/wp-content/uploads/2020/03/boat_icon.png",
      title: "OCEAN FREIGHT",
      description:
        "At T.T.P, we pride ourselves to provide timely response with effective solutions based on your international shipping needs from the comfort of your workplace. We will ensure your shipment arrives timely and safely at destination",
    },
    // 2
    {
      id: 2,
      img: "https://ttplogistics.vn/wp-content/uploads/2020/03/aroplan.png",
      title: "AIR FREIGHT",
      description:
        "We provide cost effective consolidation options to match your specific requirements. We’ll help you get the right combination of rate and transit time.",
    },
    // 3
    {
      id: 3,
      img: "https://ttplogistics.vn/wp-content/uploads/2020/03/asset_2.png",
      title: "FREIGHT MANAGEMENT SOFTWARE",
      description:
        "Boost your company’s productivity; reduce data entries; and eliminate human errors with our freight management solution reinforced with superlative features including job bookings, consignment entry, freight tracking, vehicle maintenance and more.",
    },
    // 4
    {
      id: 4,
      img: "https://ttplogistics.vn/wp-content/uploads/2020/03/contra_icon.png",
      title: "CONTAINER SERVICES",
      description: `
      * Used dry or reefer Container\n
      * Repair Reefer Container
      * Main tenance Reefer Container \n
      * Spare part supply \n
      `,
    },
    // 5
    {
      id: 5,
      img: "https://ttplogistics.vn/wp-content/uploads/2020/03/wrehousing_icon.png",
      title: "WAREHOUSING",
      description:
        "T.T.P can assist you in streamlining your processes and improve productivity with customised storage, distribution and warehousing services",
    },
    // 6
    {
      id: 6,
      img: "https://ttplogistics.vn/wp-content/uploads/2020/03/end_solution_icon.png",
      title: "END TO END SOLUTIONS",
      description:
        "T.T.P Logistics offers a full range of export/import services not only ocean port to port, but also “door to door” ocean freight forwarding, N.V.O.C.C , warehousing and distribution, cargo insurance, custom clearance.",
    },
    // 7
    {
      id: 7,
      img: "https://ttplogistics.vn/wp-content/uploads/2020/03/customs.png",
      title: "CUSTOMS CLEARANCE",
      description:
        "Getting your goods cleared through customs quickly is essential to getting them into your or your customers’ hands quickly. We can make this process streamlined and as simple as possible, taking the complexity and worry away.",
    },
    // 8
    {
      id: 8,
      img: "https://ttplogistics.vn/wp-content/uploads/2020/03/3xe2_0.png",
      title: "MULTI-TRANSPORT",
      description:
        "Our reliable and friendly operation team serves as an extension of your business offering the most reliable and cost-effective transportation solution. We handle every load as it was our own, and are constantly finding new ways to better serve our customers. We provide the Best Trucking Services.",
    },
  ];

  return (
    <>
      <div className="mb-6 bg-gray-200 p-10">
        <h1 className="font-bold text-3xl">Our Services</h1>
        <p className="text-gray">
          <span className="border-b-5 border-blue-500">
            TAILORED LOGISTIC SERVICES
          </span>
        </p>
      </div>
      <div className="grid justify-center lg:grid-cols-4 lg:grid-rows-2">
        {services &&
          services.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              img={item.img}
              title={item.title}
              description={item.description}
            />
          ))}
      </div>
    </>
  );
};

export default SectionTwo;
