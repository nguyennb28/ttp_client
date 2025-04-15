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

  console.log(detail);

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
        className="h-screen max-w-[1000px] m-4"
      >
        <div>
          <h2>{detail.ship_name}</h2>
        </div>
      </Modal>
    </>
  );
};

export default DetailCFS;
