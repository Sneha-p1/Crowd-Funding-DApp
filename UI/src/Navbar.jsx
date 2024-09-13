import React from 'react';

const Navbar = ({ account }) => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <span className="text-black">CrowdMint</span>
      </div>
      <div>
        {account ? (
          <span className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md">
            Account
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
