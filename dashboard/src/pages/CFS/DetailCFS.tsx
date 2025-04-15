import { useEffect } from "react";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { MdTipsAndUpdates } from "react-icons/md";

interface DetailCFSProps {
  detail: Record<string, any>;
  isUpdate: boolean;
  setTrigger: (value: boolean) => void;
  setTriggerUpdate?: (value: boolean) => void;
}

const DetailCFS: React.FC<DetailCFSProps> = ({
  detail,
  isUpdate,
  setTrigger,
  setTriggerUpdate,
}) => {
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    openModal();
  }, []);

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
          <div className="px-2 pr-14 border-b-3">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 uppercase">
              cfs
            </h4>
          </div>
          <div className="w-full mt-5 px-2 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 justify-between">
            {detail && (
              <>
                <div>
                  Ship name:{" "}
                  {detail["ship_name"] ? detail["ship_name"] : "Unknow"}
                </div>
                <div>MBL: {detail["mbl"] ? detail["mbl"] : "Unknow"}</div>
                <div>
                  Cotainer number:{" "}
                  {detail["container_number"]
                    ? detail["container_number"]
                    : "Unknow"}
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
          <div className="mt-10 border-b-3"></div>
          {isUpdate && (
            <div className="mt-10 flex content-center items-center">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 uppercase">
                Feature
              </h4>
              <button
                type="button"
                className="ml-10"
                onClick={() => {
                  closeModal();
                  setTrigger(false);
                  setTriggerUpdate?.(true);
                }}
                title="Update CFS"
              >
                <MdTipsAndUpdates className="size-10 text-yellow-400" />
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DetailCFS;
