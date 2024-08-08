import { Outlet } from "react-router-dom";

const GenericDemoLayout = () => {
  return (
    <div className="flex h-screen gap-2">
      <Outlet />
      <div className="flex w-full flex-col bg-gray-200">
        <Outlet />
      </div>
    </div>
  );
};

export default GenericDemoLayout;
