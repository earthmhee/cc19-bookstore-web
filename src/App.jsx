import { Outlet } from "react-router";
function App() {
  return (
    <>
      <p>Header</p>
      <Outlet />
    </>
  );
}

export default App;
