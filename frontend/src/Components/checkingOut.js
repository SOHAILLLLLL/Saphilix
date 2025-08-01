import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Phone, User, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

// Main App component to wrap the Checkout component

const ShoppingCartCheckout = () => {
    // Console log to confirm component rendering
    console.log("ShoppingCartCheckout component rendering...");

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        loginWithPhone: true
    });

    const [errors, setErrors] = useState({});
    // Initialize cartData with an empty items array to prevent map errors before data loads
    const [cartData, setCartData] = useState({ totalQuantity: 0, subtotal: 0, items: [] });
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOTP] = useState('');
    const [isLoading, setIsLoading] = useState(true); // State for loading
    const [message, setMessage] = useState(null); // State for custom messages (warnings/errors)
    const [messageType, setMessageType] = useState(null); // 'success', 'error', 'warning'

    useEffect(() => {
        console.log("useEffect: Starting data fetch...");
        async function fetchme() {
            setIsLoading(true); // Set loading to true when fetch starts
            setMessage(null); // Clear any previous messages
            setMessageType(null);
            try {
                const response = await fetch("http://10.98.119.194:8000" + "/validateData/validate", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Fetch error response:', errorData);
                    // Set error message and redirect
                    setMessage(errorData.error || 'Failed to validate cart. Please try again.');
                    setMessageType('error');
                    // Redirect after a short delay to allow user to see the message
                    setTimeout(() => {
                        window.location.href = "/cart";
                    }, 2000);
                    return; // Exit early on error
                }

                const data = await response.json();
                console.log('Validated Cart Data received:', data.cart);

                const cart = data.cart;
                setCartData({
                    totalQuantity: cart.totalQuantity,
                    subtotal: cart.subtotal,
                    items: cart.items
                });

                if (data.warnings && data.warnings.length > 0) {
                    // Display warnings using the custom message state
                    setMessage('Please review your cart:\n\n' + data.warnings.join('\n'));
                    setMessageType('warning');
                } else {
                    setMessage('Cart validated successfully!');
                    setMessageType('success');
                }

            } catch (error) {
                console.error('Error during checkout initiation:', error.message);
                setMessage(`Could not proceed to checkout: ${error.message}. Please try again.`);
                setMessageType('error');
                // Redirect after a short delay to allow user to see the message
                setTimeout(() => {
                    window.location.href = "/cart";
                }, 2000);
            } finally {
                setIsLoading(false); // Set loading to false when fetch completes (success or error)
                console.log("useEffect: Data fetch completed.");
            }
        };
        fetchme();
    }, []); // Empty dependency array means this effect runs once after the initial render

    console.log("Current cartData state:", cartData); // This will log on every render

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        } else if (formData.address.trim().length < 10) {
            newErrors.address = 'Please provide a complete address (minimum 10 characters)';
        }

        // City validation
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        // State validation
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }

        // Postal code validation
        const postalRegex = /^[0-9]{6}$/;
        if (!formData.postalCode.trim()) {
            newErrors.postalCode = 'Postal code is required';
        } else if (!postalRegex.test(formData.postalCode)) {
            newErrors.postalCode = 'Postal code must be exactly 6 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOTP = () => {
        const otpRegex = /^[0-9]{6}$/;
        if (!otp.trim()) {
            setErrors({ otp: 'OTP is required' });
            return false;
        } else if (!otpRegex.test(otp)) {
            setErrors({ otp: 'OTP must be exactly 6 digits' });
            return false;
        }
        setErrors({});
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setShowOTP(true);
            setMessage(null); // Clear any previous messages when moving to OTP
            setMessageType(null);
        } else {
            setMessage('Please correct the errors in the form.');
            setMessageType('error');
        }
    };

    const handleOTPSubmit = () => {
        if (validateOTP()) {
            setMessage('Order placed successfully! Redirecting to payment...');
            setMessageType('success');
            // In a real app, you would initiate payment here
            // For now, simulate redirection
            setTimeout(() => {
                // window.location.href = '/payment-gateway'; // Example redirection
                console.log("Simulating redirection to payment gateway.");
            }, 1500);
        } else {
            setMessage('Please enter a valid OTP.');
            setMessageType('error');
        }
    };

    // Calculate totals only if cartData is available
    const shippingFee = 50;
    const taxAmount = cartData.subtotal ? Math.round(cartData.subtotal * 0.18) : 0;
    const totalAmount = cartData.subtotal ? cartData.subtotal + shippingFee + taxAmount : 0;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 font-inter">
            <div className="max-w-6xl mx-auto">
                {/* Global Message Display */}
                {message && (
                    <div className={`p-4 mb-6 rounded-lg flex items-center gap-3 shadow-md
                        ${messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
                          messageType === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
                          'bg-yellow-100 text-yellow-800 border border-yellow-300'}`}>
                        {messageType === 'success' && <CheckCircle size={20} />}
                        {messageType === 'error' && <AlertCircle size={20} />}
                        {messageType === 'warning' && <AlertCircle size={20} />}
                        <p className="font-medium text-sm">{message}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                        <p className="ml-4 text-lg text-gray-700">Loading cart details...</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <ShoppingCart className="text-blue-600" size={24} />
                                    <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {cartData.items.length > 0 ? (
                                        cartData.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-800 text-sm leading-tight">{item.name}</h3>
                                                    <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right ml-3">
                                                    <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                                                    <p className="text-xs text-gray-500">₹{item.price} each</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm text-center py-4">Your cart is empty.</p>
                                    )}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal ({cartData.totalQuantity} items)</span>
                                        <span className="font-medium">₹{cartData.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">₹{shippingFee}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax (18%)</span>
                                        <span className="font-medium">₹{taxAmount}</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-blue-600">₹{totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout Details</h1>

                                {!showOTP ? (
                                    <div className="space-y-6">
                                        {/* Personal Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <User size={20} className="text-blue-600" />
                                                Personal Information
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter your full name"
                                                    />
                                                    {errors.fullName && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle size={14} />
                                                            {errors.fullName}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter your email"
                                                    />
                                                    {errors.email && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle size={14} />
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <Phone size={20} className="text-blue-600" />
                                                Contact Information
                                            </h3>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Enter 10-digit mobile number"
                                                    maxLength="10"
                                                />
                                                {errors.phone && (
                                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                        <AlertCircle size={14} />
                                                        {errors.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <MapPin size={20} className="text-blue-600" />
                                                Shipping Address
                                            </h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Street Address *
                                                    </label>
                                                    <textarea
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        rows="3"
                                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter complete address including house/flat number, street, landmark"
                                                    />
                                                    {errors.address && (
                                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                            <AlertCircle size={14} />
                                                            {errors.address}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            City *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="city"
                                                            value={formData.city}
                                                            onChange={handleInputChange}
                                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                                }`}
                                                            placeholder="City"
                                                        />
                                                        {errors.city && (
                                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                                <AlertCircle size={14} />
                                                                {errors.city}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            State *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="state"
                                                            value={formData.state}
                                                            onChange={handleInputChange}
                                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                                }`}
                                                            placeholder="State"
                                                        />
                                                        {errors.state && (
                                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                                <AlertCircle size={14} />
                                                                {errors.state}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Postal Code *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="postalCode"
                                                            value={formData.postalCode}
                                                            onChange={handleInputChange}
                                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.postalCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                                }`}
                                                            placeholder="6-digit PIN code"
                                                            maxLength="6"
                                                        />
                                                        {errors.postalCode && (
                                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                                <AlertCircle size={14} />
                                                                {errors.postalCode}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Login Option */}
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="loginWithPhone"
                                                    checked={formData.loginWithPhone}
                                                    onChange={handleInputChange}
                                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <div>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        Create account with this mobile number
                                                    </span>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Get order updates and exclusive offers via SMS/WhatsApp
                                                    </p>
                                                </div>
                                            </label>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                                        >
                                            Continue to Verification
                                        </button>
                                    </div>
                                ) : (
                                    /* OTP Verification */
                                    <div className="text-center">
                                        <div className="mb-6">
                                            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Verify Your Phone Number</h3>
                                            <p className="text-gray-600">
                                                We've sent a 6-digit OTP to <span className="font-medium">+91 {formData.phone}</span>
                                            </p>
                                        </div>

                                        <div className="max-w-sm mx-auto">
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Enter OTP *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => {
                                                        setOTP(e.target.value);
                                                        if (errors.otp) setErrors({}); // Clear OTP error on change
                                                    }}
                                                    className={`w-full px-4 py-3 border rounded-lg text-center text-xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.otp ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                        }`}
                                                    placeholder="000000"
                                                    maxLength="6"
                                                />
                                                {errors.otp && (
                                                    <p className="mt-2 text-sm text-red-600 flex items-center justify-center gap-1">
                                                        <AlertCircle size={14} />
                                                        {errors.otp}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <button
                                                    type="button"
                                                    onClick={handleOTPSubmit}
                                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <CreditCard size={20} />
                                                    Proceed to Payment (₹{totalAmount})
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowOTP(false);
                                                        setErrors({}); // Clear OTP errors when going back
                                                        setMessage(null); // Clear messages
                                                        setMessageType(null);
                                                    }}
                                                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2"
                                                >
                                                    ← Go Back to Edit Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ShoppingCartCheckout;