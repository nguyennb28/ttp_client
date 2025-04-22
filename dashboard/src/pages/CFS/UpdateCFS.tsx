import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { IFormField } from "../../interfaces/interfaces";
import GenericForm from "../Forms/GenericForm";

interface UpdateCFSProps {
  cfs: Record<string, any>;
  agency?: Record<string, any>[];
  port?: Record<string, any>[];
  containerSize?: Record<string, any>[];
  setTrigger: (value: boolean) => void;
  onUpdate?: (formData: Record<string, any>) => void;
  validationForm: (formData: Record<string, any>) => object;
}

const UpdateCFS: React.FC<UpdateCFSProps> = ({
  cfs,
  agency,
  port,
  containerSize,
  setTrigger,
  onUpdate,
  validationForm,
}) => {
  const { isOpen, openModal, closeModal } = useModal();

  // const [cfsInfo, setCFS] = useState<Record<string, any>>({});
  const [cfsInfo, setCFSInfo] = useState<IFormField[]>([]);
  const inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-xs shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`;
  const fields = [
    "id",
    "ship_name",
    "mbl",
    "container_number",
    "agency",
    "container_size",
    "cbm",
    "eta",
    "port",
    "actual_date",
    "end_date",
    "note",
  ];

  const exception_field = [
    "agency_name",
    "port_name",
    "container_type",
    "size",
  ];

  const labels: Record<string, any> = {
    ship_name: "Ship name",
    mbl: "MBL",
    container_number: "Container number",
    agency: "Agency",
    container_size: "Container size",
    cbm: "CBM",
    eta: "ETA",
    port: "Port",
    actual_date: "Actual date",
    end_date: "End date",
    note: "Note",
  };

  const types: Record<string, any> = {
    ship_name: "text",
    mbl: "text",
    container_number: "text",
    agency: "select",
    container_size: "select",
    cbm: "number",
    eta: "date",
    port: "select",
    actual_date: "date",
    end_date: "date",
    note: "text",
  };

  const apiSearchs: Record<string, any> = {
    agency: "/agencies/?q=",
    container_size: "/container-sizes/?q=",
    port: "/ports/?q=",
  };

  // const ruleForIFormField: Record<string, any> = {
  // ship_name: {
  // name: "ship_name",
  // label: "Ship name",
  // type: "text",
  // },
  //
  // };

  const updateFormField = () => {
    const formField = fields.reduce((acc: IFormField[], field, index) => {
      let record: IFormField = {
        name: field,
        label: labels[field],
        type: types[field],
        value: cfs[field],
        apiSearch: apiSearchs[field],
      };
      if (field == "agency") {
        record.tempValue = cfs["agency_name"];
      }
      if (field == "port") {
        record.tempValue = cfs["port_name"];
      }
      if (field == "container_size") {
        record.tempValue = `${cfs["size"]} - ${cfs["container_type"]}`;
      }
      return [
        ...acc,
        // {
        //   name: field,
        //   label: labels[field],
        //   type: types[field],
        //   value: cfs[field],
        //   apiSearch: apiSearchs[field],
        // },
        record,
      ];
    }, []);
    setCFSInfo(formField);
  };

  const handleUpdate = (e: FormEvent) => {};

  const handleCloseModal = () => {
    closeModal();
    setTrigger(false);
  };

  useEffect(() => {
    openModal();
    updateFormField();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="h-[700px] max-h-screen max-w-[1000px] m-4"
    >
      <div className="relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14 border-b-3">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 uppercase">
            Update CFS
          </h4>
        </div>
        <div className="w-full mt-5 px-2 justify-between">
          {/* <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 justify-between">
            {Object.keys(cfs).map((item, index) => (
              <div className="my-2 flex items-center" key={index}>
                <p>{item}</p>
                <div className={`ml-5 ${inputClasses}`}>{cfs[item]}</div>
              </div>
            ))}
          </form> */}
          <GenericForm
            fields={cfsInfo}
            onSubmit={onUpdate!}
            validationForm={validationForm}
          />
        </div>
      </div>
    </Modal>
  );
};
export default UpdateCFS;
