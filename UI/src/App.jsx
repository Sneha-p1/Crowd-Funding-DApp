import React, { useState } from 'react';
import { ethers } from 'ethers';
import Navbar from './Navbar';

const App = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [account, setAccount] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const createCampaign = async () => {
    const newCampaign = {
      title,
      description,
      goalAmount,
      image,
      donations: [],
    };
    setCampaigns([...campaigns, newCampaign]);
    setTitle('');
    setDescription('');
    setGoalAmount('');
    setImage(null);
    console.log('Campaign created:', newCampaign);
  };

  const donateToCampaign = async (index) => {
    if (!donationAmount) {
      alert("Please enter a donation amount.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Parse the donation amount to wei (smallest unit of Ether)
      const amountInWei = ethers.utils.parseEther(donationAmount);

      // Simulate a contract call (assume `campaignsContract` exists)
      const transaction = await signer.sendTransaction({
        to: account, // Replace with campaign contract address
        value: amountInWei,
      });

      await transaction.wait();
      console.log(`Donated ${donationAmount} ETH to campaign ${index}`);

      // Update campaign donations locally
      const updatedCampaigns = [...campaigns];
      updatedCampaigns[index].donations.push({
        amount: donationAmount,
        from: account,
      });
      setCampaigns(updatedCampaigns);

      setDonationAmount('');
    } catch (error) {
      console.error('Error during donation:', error);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);
        console.log('Connected account:', userAddress);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  return (
    <>
      <Navbar account={account}/>

      <div className="min-h-screen bg-gradient-to-r from-blue-200 to-indigo-400 p-6 flex flex-col items-center relative">
        <h1 className="text-4xl font-extrabold text-white mb-10 text-center">
          CrowdMint
        </h1>

        {account && (
          <div className="absolute top-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        )}

        <button
          onClick={connectWallet}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg mb-10 hover:bg-purple-700 transform transition-transform hover:scale-105"
        >
          Connect Wallet
        </button>

        {/* Project Creation Form */}
        <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-lg mb-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Create a New Project
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-600 font-semibold">Title</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project Title"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold">
                Description
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project Description"
                rows="4"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold">
                Goal Amount (ETH)
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="Goal Amount"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold">
                Upload Image
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {image && (
                <img
                  src={image}
                  alt="Campaign Preview"
                  className="mt-4 w-full h-64 object-cover rounded-lg"
                />
              )}
            </div>

            <button
              onClick={createCampaign}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transform transition-transform hover:scale-105"
            >
              Create Project
            </button>
          </div>
        </div>

        {/* Project List */}
        <div className="w-full max-w-6xl bg-white p-8 shadow-xl rounded-lg mb-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Active Projects</h2>

          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col justify-between"
                >
                  {campaign.image && (
                    <img
                      src={campaign.image}
                      alt="Campaign"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div>
                    <div className="text-lg font-bold text-indigo-600">
                      {campaign.title}
                    </div>
                    <div className="text-gray-600 mt-2">{campaign.description}</div>
                    <div className="text-green-600 font-semibold mt-2">
                      Goal: {campaign.goalAmount} ETH
                    </div>
                  </div>

                  <div className="mt-4">
                    <input
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Enter Donation Amount (ETH)"
                    />
                    <button
                      onClick={() => donateToCampaign(index)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg mt-3 hover:bg-green-700 transform transition-transform hover:scale-105 w-full"
                    >
                      Donate
                    </button>
                  </div>

                  {campaign.donations.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Donations:
                      </h3>
                      <ul className="divide-y divide-gray-300">
                        {campaign.donations.map((donation, i) => (
                          <li
                            key={i}
                            className="py-1 flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-600">
                              From: {donation.from}
                            </span>
                            <span className="text-indigo-600 font-bold">
                              {donation.amount} ETH
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No campaigns created yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
