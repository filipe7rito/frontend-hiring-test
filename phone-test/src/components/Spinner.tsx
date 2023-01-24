import React from 'react';

export default function Spinner() {
  return (
    <svg
      className="spinner"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.75C6.62069 21.75 2.25 17.3793 2.25 12C2.25 6.62069 6.62069 2.25 12 2.25V3.23276C7.16379 3.23276 3.23276 7.16379 3.23276 12C3.23276 16.8362 7.16379 20.7672 12 20.7672C16.8362 20.7672 20.7672 16.8362 20.7672 12H21.75C21.75 17.3793 17.3793 21.75 12 21.75Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
