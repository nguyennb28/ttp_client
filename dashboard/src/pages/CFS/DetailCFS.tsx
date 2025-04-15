import { useEffect } from "react";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";

interface DetailCFSProps {
  trigger: boolean;
  detail: Record<string, any>;
  setTrigger: (value: boolean) => void;
}

const DetailCFS: React.FC<DetailCFSProps> = ({
  trigger,
  detail,
  setTrigger,
}) => {
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    if (trigger) {
      openModal();
    } else {
      closeModal();
    }
  }, [trigger]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          closeModal();
          setTrigger(false);
        }}
        className="h-[700px] max-h-screen max-w-[1000px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14 border-b-1">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 uppercase">
              cfs
            </h4>
          </div>
          <div className="border-b-2"></div>
          <div className="w-full mt-5 px-2 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 justify-between">
            {detail && (
              <>
                <div>
                  Ship name:{" "}
                  {detail["ship_name"] ? detail["ship_name"] : "Unknow"}
                </div>
                <div>
                  Cotainer number: {detail["mbl"] ? detail["mbl"] : "Unknow"}
                </div>
                <div>
                  Agency:{" "}
                  {detail["agency_name"] ? detail["agency_name"] : "Unknow"}
                </div>
                <div>
                  Container size:{" "}
                  {detail["size"] && detail["container_type"]
                    ? `${detail["size"]} - ${detail["container_type"]}`
                    : "Unknow"}
                </div>
                <div>
                  Port: {detail["port_name"] ? detail["port_name"] : "Unknow"}
                </div>
                <div>CBM: {detail["cbm"] ? detail["cbm"] : "Unknow"}</div>
                <div>ETA: {detail["eta"] ? detail["eta"] : "Unknow"}</div>
                <div>
                  Actual date:{" "}
                  {detail["actual_date"] ? detail["actual_date"] : "Unknow"}
                </div>
                <div>
                  End date:{" "}
                  {detail["enda_date"] ? detail["end_date"] : "Unknow"}
                </div>
                <div>Note: {detail["note"] ? detail["note"] : "Empty"}</div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DetailCFS;
