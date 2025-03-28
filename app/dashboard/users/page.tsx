import UsersTableView from "@/components/data-tables/users/users-table-view";
import React from "react";

type DashboardUsersPageProps = {};

const DashboardUsersPage: React.FC<DashboardUsersPageProps> = ({}) => {
  return (
    <div className="main">
      {/* <Button>
        <PlusCircle />
        <span>Nouveau utilista</span>
      </Button> */}
      <UsersTableView />
    </div>
  );
};

export default DashboardUsersPage;
