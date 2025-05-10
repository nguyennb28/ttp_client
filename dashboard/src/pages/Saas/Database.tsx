import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCardExtend from "../../components/common/ComponentCardExtend";
import PageMeta from "../../components/common/PageMeta";
import { useLoading } from "../../context/LoadingContext";
import { useModal } from "../../hooks/useModal";
import { useState, useEffect } from "react";
import axiosInstance from "../../instance/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/ui/modal";

const DatabaseSaas = () => {
  // Context
  const { loading, showLoading, hideLoading } = useLoading();
  const { isOpen, openModal, closeModal } = useModal();
  const { checkAdmin, checkAuth } = useAuth();

  const cleanStates = () => {};

  const features = async (e: string) => {
    if (e == "refresh") {
      cleanStates();
      try {
        // make something
      } catch (err) {
        // make something
      }
    }
    if (e == "create") {
      openModal();
    }
    if (e == "delete") {
      // make handle delete
    }
  };

  useEffect(() => {
    const refreshToken = async () => {
      try {
        showLoading();
        await checkAuth();
      } catch (err) {
        console.error(err);
      } finally {
        hideLoading();
      }
    };
    refreshToken();
    checkAdmin();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <>
      {/* <div>Database-Saas</div> */}
      <PageMeta
        title="Database for client"
        description="This is a feature create datbase for logistics companies"
      />
      <PageBreadcrumb pageTitle="Database" />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="h-screen max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add database
            </h4>
          </div>
        </div>
      </Modal>
      <div className="space-y-6">
        <ComponentCardExtend title="Database table" features={features}>
          <></>
        </ComponentCardExtend>
      </div>
    </>
  );
};

export default DatabaseSaas;
