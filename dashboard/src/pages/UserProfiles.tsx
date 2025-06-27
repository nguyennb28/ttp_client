import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserInfoCardRenew from "../components/UserProfile/UserInfoCardRenew";
import PageMeta from "../components/common/PageMeta";
import useProfile from "../hooks/useProfile";
import UserMetaCardRenew from "../components/UserProfile/UserMetaCardRenew";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import { useState, useEffect } from "react";
import axiosInstance from "../instance/axiosInstance";

type ProfileProps = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  tax_code: string;
  role: string;
  tenant_db: string;
};

export default function UserProfiles() {
  // Hook
  // const profile = useProfile() as ProfileProps | null | undefined;
  const { profile, loader, error } = useProfile();

  // Context
  const { checkAuth, countTimeToRefresh, callRefreshToken } = useAuth();
  const { loading, showLoading, hideLoading } = useLoading();

  // hidden array
  const hiddeArr = ["id", "full_name"];

  // disable array
  const disabledArr = ["username", "role", "tenant_db"];

  const handleSubmit = async (value: any) => {
    try {
      showLoading();
      const response = await axiosInstance.patch(`/users/${value.id}/`, {
        ...value,
      });
      if (response.status == 200) {
        alert("Updated");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Update Failed");
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    checkAuth();

    const tokenTimeout = setTimeout(() => {
      callRefreshToken();
    }, countTimeToRefresh());

    return () => clearTimeout(tokenTimeout);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          {profile && (
            <UserMetaCardRenew
              first_name={profile.first_name}
              last_name={profile.last_name}
              role={profile.role}
            />
          )}
          <UserInfoCardRenew
            data={profile}
            hiddenArr={hiddeArr}
            disabledArr={disabledArr}
            submit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
