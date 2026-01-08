import { Outlet } from 'react-router-dom';
import './AuthLayout.css'; 

function AuthLayout() {
  return (
    <>
      <h1>Welcome to TaskManager, </h1>
      <p style={{ marginTop: '0px', marginBottom: '10px', color: 'purple' }}>
        an easy way to manage and share your todo list. 
      </p>
      <Outlet /> {/* renders nested route (login or register) */}
    </>
  )
}

export default AuthLayout;