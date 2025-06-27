import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import useVatInfo from "../../hooks/useVatInfo";

type PaymentDocumentValuesForm = {
  // 1
  spc: string;
  // 2
  settlement_date: string | null;
  // 3
  company_name: string;
  // 4
  employee_name: string;
  // 5
  product_name: string;
  // 6
  declaration: string;
  // 7
  bln: string;
  // 8
  product_detail: string;
  // 9
  agent: string;
};

interface PaymentDocumentProps {
  paymentDocument: any;
  onSetPaymentDocument: (value: any) => void;
}

const PaymentDocumentForm: React.FC<PaymentDocumentProps> = ({
  paymentDocument,
  onSetPaymentDocument,
}) => {
  // Auth context
  const { user } = useAuth();

  // Hook
  const { vatInfo } = useVatInfo(user?.tax_code);

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentDocumentValuesForm>();
  const onSubmit: SubmitHandler<PaymentDocumentValuesForm> = async (data) => {
    try {
      onSetPaymentDocument(data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    console.log(user);
    console.log(vatInfo);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* SPC */}
          <div className="mt-3">
            <p>SPC</p>
            <input
              type="text"
              placeholder="SPC"
              className="border-2 rounded-xl w-full p-3 border-black click:border-sky-500 shadow-md"
              {...register("spc", {
                required: "Nhập SPC",
                minLength: {
                  value: 5,
                  message: "Ít nhất 1 ký tự",
                },
              })}
            />
            {errors.spc && (
              <p className="mt-3 text-red-500 self-start">
                {errors.spc.message}
              </p>
            )}
          </div>
          {/* Settlement Date */}
          <div className="mt-3">
            <p>Ngày quyết toán</p>
            <input
              type="date"
              className="border-2 rounded-xl w-full p-3 border-black click:border-sky-500 shadow-md"
              placeholder="Ngày quyết toán"
              title="Ngày quyết toán"
              {...register("settlement_date")}
            />
            {errors.settlement_date && (
              <p className="mt-3 text-red-500 self-start">
                {errors.settlement_date.message}
              </p>
            )}
          </div>
          {/* Company Name */}
          <div className="mt-3">
            <p>Kính gửi (Công ty)</p>
            <input
              type="text"
              className="border-2 rounded-xl w-full p-3 border-black click:border-sky-500 shadow-md"
              placeholder="Tên công ty"
              {...register("company_name", {
                required: "Nhập tên công ty",
                minLength: {
                  value: 10,
                  message: "Có độ dài ít nhất 10 ký tự",
                },
              })}
            />
            {errors.company_name && (
              <p className="mt-3 text-red-500 self-start">
                {errors.company_name.message}
              </p>
            )}
          </div>
          {/* Employee Name */}
          <div className="mt-3">
            <p>Họ tên</p>
            <input
              type="text"
              className="border-2 rounded-xl w-full p-3 border-black click:border-sky-500 shadow-md"
              placeholder="Tên nhân viên"
              {...register("employee_name", {
                required: "Nhập tên nhân viên",
                minLength: {
                  value: 10,
                  message: "Có độ dài ít nhất 10 ký tự",
                },
              })}
            />
            {errors.employee_name && (
              <p className="mt-3 text-red-500 self-start">
                {errors.employee_name.message}
              </p>
            )}
          </div>
          {/* Product Name */}
          <div className="mt-3">
            <p>Tên hàng</p>
            <input
              type="text"
              className="border-2 rounded-xl w-full p-3 border-black click:border-sky-500 shadow-md"
              placeholder="Tên hàng"
              {...register("product_name", {
                required: "Nhập tên hàng",
                minLength: {
                  value: 10,
                  message: "Có độ dài ít nhất 10 ký tự",
                },
              })}
            />
            {errors.product_name && (
              <p className="mt-3 text-red-500 self-start">
                {errors.product_name.message}
              </p>
            )}
          </div>
          {/* Declaration */}
          <div className="mt-3">
            <p>Tờ khai</p>
            <input
              type="text"
              className="border-2 rounded-xl w-full p-3 border-black click:border-sky-500 shadow-md"
              placeholder="Tờ khai"
              {...register("declaration", {
                required: "Nhập tờ khai",
                minLength: {
                  value: 10,
                  message: "Có độ dài ít nhất 10 ký tự",
                },
              })}
            />
            {errors.declaration && (
              <p className="mt-3 text-red-500 self-start">
                {errors.declaration.message}
              </p>
            )}
          </div>
          {/* Bill of Lading Number */}
          <div className="mt-3">
            <p>Số vận đơn</p>
            <input
              type="text"
              className="border-2 rounded-xl w-full p-3 border-black click:border-sky-500 shadow-md"
              placeholder="Số vận đơn"
              {...register("bln", {
                required: "Nhập số vận đơn",
                minLength: {
                  value: 10,
                  message: "Có độ dài ít nhất 10 ký tự",
                },
              })}
            />
            {errors.bln && (
              <p className="mt-3 text-red-500 self-start">
                {errors.bln.message}
              </p>
            )}
          </div>
          {/* Product detail */}
          <div className="mt-3">
            <p>Chi tiết hàng</p>
            <input
              type="text"
              className="border-2 rounded-xl w-full p-3 border-black click:border-sky-500 shadow-md"
              placeholder="Chi tiết hàng"
              {...register("product_detail", {
                required: "Nhập chi tiết hàng",
                minLength: {
                  value: 10,
                  message: "Có độ dài ít nhất 10 ký tự",
                },
              })}
            />
            {errors.product_detail && (
              <p className="mt-3 text-red-500 self-start">
                {errors.product_detail.message}
              </p>
            )}
          </div>
          {/* Agent */}
          <div className="mt-3">
            <p>Chủ hàng/Đại lý</p>
            <input
              type="text"
              className="border-2 rounded-xl w-full p-3 border-black click:border-sky-500 shadow-md"
              placeholder="Chủ hàng/Đại lý"
              {...register("agent", {
                required: "Nhập chủ hàng/đại lý",
                minLength: {
                  value: 10,
                  message: "Có độ dài ít nhất 10 ký tự",
                },
              })}
            />
            {errors.agent && (
              <p className="mt-3 text-red-500 self-start">
                {errors.agent.message}
              </p>
            )}
          </div>
        </div>
        {/* Extend Form */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div></div>
        </div>
        {/* Submit */}
        <div className="mt-5 text-center">
          <button
            type="submit"
            className="p-3 rounded-xl cursor-pointer w-80 bg-sky-300 hover:bg-sky-700 uppercase font-semibold"
          >
            {isSubmitting ? "Đang xử lý" : "Lưu"}
          </button>
        </div>
      </form>
    </>
  );
};

export default PaymentDocumentForm;
