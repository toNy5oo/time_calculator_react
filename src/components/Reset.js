import React, { useEffect } from "react";

const Reset = () => {
  useEffect(() => {
    // Reset local storage
    localStorage.clear();

    // Redirect to main page after reset
    window.location.href = "/";
  }, []);

  return (
    <div>
      <h1>Local Storage Reset Page</h1>
      <p>Local storage has been reset.</p>
    </div>
  );
};

export default Reset;
