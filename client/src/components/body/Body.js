import { Outlet, useLocation } from "react-router-dom";

function Body() {
  const location = useLocation();
  const isDashboard = location.pathname === "/" || location.pathname === "/news";

  return (
    <div
      className={
        isDashboard
          ? "flex flex-col flex-grow w-full min-w-0"
          : "flex flex-grow items-center justify-center p-4 w-full h-full"
      }
    >
      <Outlet />
    </div>
  );
}

export default Body;
