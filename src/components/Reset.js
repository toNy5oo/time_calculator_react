import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Reset = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Reset local storage
    localStorage.clear();

    // Optionally, you can set some initial values after clearing
    // localStorage.setItem('key', 'value');

    // Redirect to another route after reset
    navigate("/");
  }, [navigate]);

  return (
    <div>
      <h1>Local Storage Reset Page</h1>
      <p>Local storage has been reset.</p>
    </div>
  );
};

export default Reset;
