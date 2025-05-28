import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserInfoCardRenew from "../components/UserProfile/UserInfoCardRenew";
import PageMeta from "../components/common/PageMeta";
import useProfile from "../hooks/useProfile";
import UserMetaCardRenew from "../components/UserProfile/UserMetaCardRenew";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

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
  const profile = useProfile() as ProfileProps | null | undefined;

  // Context
  const { checkAuth, countTimeToRefresh, callRefreshToken } = useAuth();

  // State
  const [info, setInfo] = useState({});

  // hidden array
  const hiddeArr = ["id", "full_name"];

  // disable array
  const disabledArr = ["username", "role", "tenant_db"];

  const handleUser = (value: any) => {
    setInfo((prev) => ({
      ...prev,
      value,
    }));
  };

  useEffect(() => {
    checkAuth();

    const tokenTimeout = setTimeout(() => {
      callRefreshToken();
    }, countTimeToRefresh());

    return () => clearTimeout(tokenTimeout);
  }, []);

  useEffect(() => { 
    // console.log(info);
  }, [info]);

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
            handle={handleUser}
          />
        </div>
      </div>
    </>
  );
}
