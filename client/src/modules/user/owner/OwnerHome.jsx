import  { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../../../api.js' ;
import Navbar from '../../../components/Navbar.jsx';

export default function OwnerHome() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('Add Property');
  
  // Form State
  const [formData, setFormData] = useState({
    propertyType: 'Residential',
    propertyAdType: 'Rent',
    propertyAddress: '',
    ownerContact: '',
    propertyAmount: 0,
    availability: true,
    propertyImages:'',
    additionalDetails: '',
  });

  // Selected files count or name state for UI display
  // const [selectedFileNames, setSelectedFileNames] = useState('No file chosen');

  // Status Alerts State
  const [status, setStatus] = useState({
    type: '', // 'success' | 'error' | ''
    message: '',
  });
  const [loading, setLoading] = useState(false);

  // Properties List State with Sample Data
  const [properties, setProperties] = useState([]);
    const [Bookingproperties, setBookingProperties] = useState([]);
//fetching bookings for owner
useEffect(()=>{
  const fetchBookings= async()=>{
    try {
      const response= await axios.get(`${api}/api/booking/owner-bookings/${user._id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log("Fetched Bookings:60",response.data.bookings);

      // Transform the bookings data to match the UI structure
      const transformedBookings = response.data.bookings.map(booking => ({
        bookingid: booking._id,
        propertyId: booking.propertyId._id,
        tenantName: booking.userId?.name || booking.tenantName,
        tenantPhone: booking.phoneNumber,
        bookinstatus: booking.bookingStatus
      }));

      setBookingProperties(transformedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
    }
  };
  if(user && token) fetchBookings();
},[user,token]);

  // Route Protection & Loading User Data + Fetch Properties
  useEffect(() => {
    const initializeUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!storedToken || !storedUser) {
        alert('Access Denied. Please login first.');
        window.location.href = '/auth/login';
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.type !== 'Owner') {
          alert('Access Denied. Owner access only.');
          window.location.href = '/';
          return;
        }

        // Set user and token state
        setUser(parsedUser);
        setToken(storedToken);

        // Fetch properties after setting state
        try {
          const response = await axios.get(`${api}/api/owner/myProperties/${parsedUser._id}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          console.log("Fetched properties:", response.data.properties);
          setProperties(response.data.properties);
        } catch (error) {
          console.error("Error fetching properties:", error.message);
          alert('Error fetching properties. Please try again later.');
         }
      } catch (err) {
        console.error('Error parsing user data', err);
        window.location.href = '/auth/login';
      }
    };

    initializeUser();
  }, []);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editFormData, setEditFormData] = useState({
    propertyType: '',
    propertyAdType: '',
    propertyAddress: '',
    ownerContact: '',
    propertyAmount: 0,
    availability:Boolean,
    additionalDetails: '',
  });

  // Delete Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePropertyId, setDeletePropertyId] = useState(null);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'propertyAmount' ? Number(value) : value,
    }));
    // Clear status
    if (status.message) {
      setStatus({ type: '', message: '' });
    }
  };

   
  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      propertyType,
      propertyAdType,
      propertyAddress,
      ownerContact,
      propertyAmount,
      propertyImages,
      additionalDetails,
      availability
    } = formData;

    // Validations
    if (!propertyAddress.trim()) {
      setStatus({ type: 'error', message: 'Property full address is required.' });
      return;
    }
    if (!ownerContact.trim()) {
      setStatus({ type: 'error', message: 'Owner contact number is required.' });
      return;
    }
    if (propertyAmount <= 0) {
      setStatus({ type: 'error', message: 'Property amount must be greater than 0.' });
      return;
    }
    // if (propertyImages.length === 0) {
    //   setStatus({ type: 'error', message: 'Please upload at least one property image.' });
    //   return;
    // }
    if (!additionalDetails.trim()) {
      setStatus({ type: 'error', message: 'Additional details for the property are required.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post(
        `${api}/api/owner/newProperty`,
        {
          ownerId: user._id,
          OwnerName: user.name,
          propertyType,
          propertyAdType,
          propertyAddress,
          ownerContact,
          propertyAmount,
          propertyImages,
          availability,
          additionalDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setStatus({
          type: 'success',
          message: 'Property created successfully!',
        });
        
        // Reset form
        setFormData({
          propertyType: 'Residential',
          propertyAdType: 'Rent',
          propertyAddress: '',
          ownerContact: '',
          propertyAmount: 0,
          propertyImages: '',
          additionalDetails: '',
          availability: true,
        });
        // setSelectedFileNames('No file chosen');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setStatus({
          type: 'error',
          message: response.data.message || 'Failed to create property.',
        });
      }
    } catch (error) {
      console.error('Submit property error:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Server connection error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

 
  // Open Edit Modal
  const openEditModal = (property) => {
    setEditingProperty(property);
    setEditFormData({
      propertyType: property.propertyType,
      propertyAdType: property.propertyAdType,
      propertyAddress: property.propertyAddress,
      ownerContact: property.ownerContact,
      propertyAmount: property.propertyAmount,
      additionalDetails: property.additionalDetails,
      availability:property.availability
    });
    console.log('223-', property.availability);
    setShowEditModal(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProperty(null);
  };

  // Handle Edit Form Changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === 'propertyAmount' ? Number(value) : value,
    }));
  };

  // Save Edited Property
  const saveEditedProperty = async () => {
    if (!editFormData.propertyAddress.trim()) {
      alert('Property address is required.');
      return;
    }
    if (!editFormData.ownerContact.trim()) {
      alert('Owner contact is required.');
      return;
    }
    if (editFormData.propertyAmount <= 0) {
      alert('Property amount must be greater than 0.');
      return;
    }

    // Update property in the list
       await axios.put(`${api}/api/owner/updateProperty/${editingProperty._id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Property details updated successfully");
    setShowEditModal(false);
    setEditingProperty(null);
    window.location.reload();
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = (propertyId) => {
    setDeletePropertyId(propertyId);
    setShowDeleteModal(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePropertyId(null);
  };

  // Delete Property
  const deleteProperty = async () => {
    await axios.delete(`${api}/api/owner/deleteProperty/${deletePropertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Property deleted successfully");
    setShowDeleteModal(false);
    setDeletePropertyId(null);
    window.location.reload();
  };


  const handleBookingStatusChange= async(propertyId, newStatus)=>{
    console.log("Booking ID:", propertyId, "New Status:", newStatus);

    try{

        const response= await axios.put(`${api}/api/booking/bookings/status/${propertyId}`,{
            bookingStatus: newStatus
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Booking status updated:", response.data);
        alert("Booking status updated successfully");
    }
    catch(error){
      console.error("Error updating booking status:", error);
      alert("Error updating booking status. Please try again.");
    }
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-t-2 border-indigo-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d19] text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
     <Navbar user={user}  />
        <title>OwnerHome - RentHub</title>

      {/* Tabs Selector Bar */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-4">
        <div className="flex gap-8 border-b border-slate-800/80 pb-3">
          {['Add Property', 'All Properties', 'All Bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative font-semibold text-sm transition-all duration-200 pb-3 -mb-3 cursor-pointer ${
                activeTab === tab
                  ? 'text-[#5969f6]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5969f6] rounded-full shadow-[0_0_8px_#5969f6]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area Container */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 mt-8 flex-1">
        <div className="border border-slate-800/80 rounded-2xl p-6 md:p-10 bg-[#0c1325]/40 backdrop-blur-sm min-h-[500px] flex flex-col">
          {activeTab === 'Add Property' ? (
            <div className="w-full max-w-5xl mx-auto bg-[#0d1527] border border-slate-800/90 rounded-2xl p-8 md:p-10 shadow-2xl relative">
              {/* Form Title */}
              <h2 className="text-3xl font-extrabold text-center text-[#5969f6] mb-10 tracking-tight">
                Add New Property
              </h2>

              {/* Status Alert Overlay/Notifications */}
              {status.message && (
                <div
                  className={`mb-6 p-4 rounded-xl text-sm font-semibold border flex items-start gap-3 animate-fadeIn ${
                    status.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                      : 'bg-rose-950/80 border-rose-500/40 text-rose-400'
                  }`}
                >
                  {status.type === 'success' ? (
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              {/* Property Details Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 3 Column Grid layout matching the reference image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                  {/* Property Type Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Property Type
                    </label>
                    <div className="relative">
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-sm"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="House">House</option>
                        <option value="Penthouse">Penthouse</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Property Ad Type Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Property Ad Type
                    </label>
                    <div className="relative">
                      <select
                        name="propertyAdType"
                        value={formData.propertyAdType}
                        onChange={handleChange}
                        className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-sm"
                      >
                        <option value="Rent">Rent</option>
                        <option value="Sale">Sale</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Property Full Address */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Property Full Address
                    </label>
                    <input
                      type="text"
                      name="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                    />
                  </div>

                  {/* Property Images File Upload Component */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Property Images
                    </label>
                    <div className="flex items-center w-full bg-[#182035] border border-slate-800 rounded-lg py-1 px-2.5 relative">
                      <input
                        type="text"
                        name='propertyImages'
                        value={formData.propertyImages}
                        onChange={handleChange}
                        placeholder='enter img'
                        className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                        // multiple
                        // accept="image/*"
                        // onChange={handleImageChange}
                        // id="file-upload"
                        // className="sr-only"
                      />
                      {/* <label
                        htmlFor="file-upload"
                        className="bg-[#5969f6] hover:bg-[#4958df] text-white font-semibold text-xs py-2.5 px-4 rounded-md cursor-pointer transition-all duration-200 shadow-md active:scale-95"
                      >
                        Choose Files
                      </label>
                      <span className="text-slate-400 text-xs ml-3 truncate max-w-[150px]">
                        {selectedFileNames}
                      </span> */}
                    </div>
                  </div>

                  {/* Owner Contact Number */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Owner Contact No.
                    </label>
                    <input
                      type="text"
                      name="ownerContact"
                      value={formData.ownerContact}
                      onChange={handleChange}
                      placeholder="Contact number"
                      className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                    />
                  </div>

                  {/* Property Amount */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                      Property Amount
                    </label>
                    <input
                      type="number"
                      name="propertyAmount"
                      value={formData.propertyAmount}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                    />
                  </div>

               <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                     Availability
                    </label>
                    <div className="relative">
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-sm"
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details (Full Width) */}
                <div className="flex flex-col">
                  <label className="text-slate-300 font-semibold text-sm mb-2">
                    Additional Details for the Property
                  </label>
                  <textarea
                    name="additionalDetails"
                    value={formData.additionalDetails}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Add any details here..."
                    className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
                  ></textarea>
                </div>

                {/* Submit Form Button Container */}
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-[#5969f6] hover:bg-[#4958df] text-white font-bold text-sm px-8 py-3 rounded-lg transition-all duration-200 shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer ${
                      loading ? 'opacity-85 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      'Submit Form'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : activeTab === 'All Properties' ? (
            <div className="w-full">
              {/* Properties Table */}
              <div className="overflow-x-auto">
                {properties.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg className="w-16 h-16 text-slate-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
                    <p className="text-slate-400 text-sm">Start by adding a new property to see them listed here.</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#5969f6]/20 border-b border-slate-700">
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Property ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Property Type</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Ad Type</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Address</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Owner Contact</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Availability</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-[#5969f6]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr
                          key={property._id}
                          className="border-b border-slate-700/50 hover:bg-slate-900/30 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-sm text-slate-300 font-mono truncate max-w-xs" title={property._id}>
                            {property._id}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {property.propertyType}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {property.propertyAdType}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 max-w-xs truncate" title={property.propertyAddress}>
                            {property.propertyAddress}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {property.ownerContact}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 font-semibold">
                            ₹{property.propertyAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 text-sm">
                          {property.availability ? (
                            <span className="px-3 py-1 bg-emerald-600/30 text-emerald-400 text-xs font-semibold rounded-full">
                              Available
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-rose-600/30 text-rose-400 text-xs font-semibold rounded-full">
                              Not Available
                            </span>
                          )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => openEditModal(property)}
                                className="px-4 py-1.5 bg-[#5969f6] hover:bg-[#4958df] text-white text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(property._id)}
                                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Edit Modal */}
              {showEditModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-[#0d1527] border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-[#5969f6]">Edit Property Details</h2>
                      <button
                        onClick={closeEditModal}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Modal Form */}
                    <form className="space-y-6">
                      {/* Property Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <label className="text-slate-300 font-semibold text-sm mb-2">
                            Property Type
                          </label>
                          <div className="relative">
                            <select
                              name="propertyType"
                              value={editFormData.propertyType}
                              onChange={handleEditFormChange}
                              className="w-full bg-[#182035] border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-sm"
                            >
                              <option value="Residential">Residential</option>
                              <option value="Commercial">Commercial</option>
                              <option value="Apartment">Apartment</option>
                              <option value="Villa">Villa</option>
                              <option value="House">House</option>
                              <option value="Penthouse">Penthouse</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Ad Type */}
                        <div className="flex flex-col">
                          <label className="text-slate-300 font-semibold text-sm mb-2">
                            Property Ad Type
                          </label>
                          <div className="relative">
                            <select
                              name="propertyAdType"
                              value={editFormData.propertyAdType}
                              onChange={handleEditFormChange}
                              className="w-full bg-[#182035] border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-sm"
                            >
                              <option value="Rent">Rent</option>
                              <option value="Sale">Sale</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex flex-col">
                        <label className="text-slate-300 font-semibold text-sm mb-2">
                          Property Address
                        </label>
                        <input
                          type="text"
                          name="propertyAddress"
                          value={editFormData.propertyAddress}
                          onChange={handleEditFormChange}
                          className="w-full bg-[#182035] border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                        />
                      </div>

                      {/* Contact and Amount Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <label className="text-slate-300 font-semibold text-sm mb-2">
                            Owner Contact No.
                          </label>
                          <input
                            type="text"
                            name="ownerContact"
                            value={editFormData.ownerContact}
                            onChange={handleEditFormChange}
                            className="w-full bg-[#182035] border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-slate-300 font-semibold text-sm mb-2">
                            Property Amount
                          </label>
                          <input
                            type="number"
                            name="propertyAmount"
                            value={editFormData.propertyAmount}
                            onChange={handleEditFormChange}
                            className="w-full bg-[#182035] border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                          />
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="flex flex-col">
                        <label className="text-slate-300 font-semibold text-sm mb-2">
                          Additional Details
                        </label>
                        <textarea
                          name="additionalDetails"
                          value={editFormData.additionalDetails}
                          onChange={handleEditFormChange}
                          rows="4"
                          className="w-full bg-[#182035] border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
                        ></textarea>
                      </div>

                      {/* Availability Dropdown */}
                        <div className="flex flex-col">
                    <label className="text-slate-300 font-semibold text-sm mb-2">
                     Availability
                    </label>
                    <div className="relative">
                      <select
                        name="availability"
                        value={editFormData.availability}
                        onChange={handleEditFormChange}
                        className="w-full bg-[#182035] border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer text-sm"
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                      {/* Modal Actions */}
                      <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-slate-700">
                        <button
                          type="button"
                          onClick={closeEditModal}
                          className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveEditedProperty}
                          className="px-6 py-2.5 bg-[#5969f6] hover:bg-[#4958df] text-white font-semibold text-sm rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-[#0d1527] border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M9 5a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-white">Delete Property?</h2>
                    </div>

                    {/* Modal Body */}
                    <p className="text-slate-400 text-base mb-8">
                      Are you sure you want to delete this property? This action cannot be undone.
                    </p>

                    {/* Modal Actions */}
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={closeDeleteModal}
                        className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={deleteProperty}
                        className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        Delete Property
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
          <div className="w-full">
              {/* Properties Table */}
              <div className="overflow-x-auto">
                {Bookingproperties.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg className="w-16 h-16 text-slate-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
                    <p className="text-slate-400 text-sm">Start by adding a new property to see them listed here.</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#5969f6]/20 border-b border-slate-700">
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Booking ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Property ID</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Tenant Name</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Tenant Phone</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-[#5969f6]">Booking Status</th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-[#5969f6]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Bookingproperties.map((property) => (
                        <tr
                          key={property.bookingid}
                          className="border-b border-slate-700/50 hover:bg-slate-900/30 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-sm text-slate-300 font-mono truncate max-w-xs" title={property.bookingid}>
                            {property.bookingid}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {property.propertyId}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300 capitalize">
                            {property.tenantName}
                          </td>
                         
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {property.tenantPhone}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {property.bookinstatus}
                          </td>
                          {property.bookinstatus === 'pending' ? (
                            <td className="px-6 py-4 text-large text-slate-300 font-semibold">
                              <button 
                              className="bg-[#00FF1E] hover:bg-[#4a58d6] text-white py-2 px-4 rounded-md transition-colors duration-150"
                              onClick={() => handleBookingStatusChange(property.bookingid, 'confirmed')}
                              >
                                Mark as confirmed
                              </button>
                            </td>
                          ) : (
                            <td className="px-6 py-4 text-large text-slate-300 font-semibold">
                              <button className="bg-[#E6E620] hover:bg-[#4a58d6] text-green-300 py-2 px-4 rounded-md transition-colors duration-150">
                                Mark as Pending
                              </button>
                            </td>
                          )}
                       
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>


            </div>
          )}
        </div>
      </main>
    </div>
  );
}
