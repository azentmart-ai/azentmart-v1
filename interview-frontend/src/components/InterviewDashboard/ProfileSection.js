import React, { useState, useEffect } from "react";
import { FiCreditCard, FiX } from "react-icons/fi";

const ProfileSection = ({ onClose, setActivePage }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) {
                setCurrentUser(storedUser);
            }
        } catch (e) {
            console.error("Error reading user data:", e);
        }
    }, []);

    // Smooth Reverse Close Handler
    const handleReverseClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200); // Wait for reverse animation to finish
    };

    const userEmail = currentUser?.email || "balaraman051002@gmail.com";

    const handleSignOutAll = () => {
        if (window.confirm("Are you sure you want to sign out from all other devices?")) {
            alert("Signed out from all other devices successfully.");
        }
    };

    const handleDeleteAccount = () => {
        if (
            window.confirm(
                "Deleting your account will permanently remove all your data, credits, active subscriptions, and lifetime plans. Are you sure?"
            )
        ) {
            localStorage.removeItem("user");
            window.location.href = "/";
        }
    };

    return (
        <div
            className={`profile-modal-backdrop ${isClosing ? "closing" : ""}`}
            onClick={handleReverseClose}
        >
            <div
                className={`profile-modal-container ${isClosing ? "closing" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="profile-modal-header">
                    <div>
                        <h2>Profile</h2>
                        <p>Manage your account, billing, and subscriptions.</p>
                    </div>
                    <button
                        type="button"
                        className="profile-modal-close"
                        onClick={handleReverseClose}
                    >
                        <FiX />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="profile-modal-body">
                    {/* General */}
                    <div className="profile-modal-card">
                        <h3>General</h3>
                        <div className="profile-modal-field">
                            <label>Email</label>
                            <input type="text" value={userEmail} disabled />
                        </div>
                    </div>

                    {/* Credits */}
                    <div className="profile-modal-card">
                        <div className="profile-card-header-action">
                            <h3>Credits</h3>
                            <button
                                type="button"
                                className="profile-action-btn"
                                onClick={() => {
                                    handleReverseClose();
                                    setActivePage && setActivePage("upgrade");
                                }}
                            >
                                Buy Credits →
                            </button>
                        </div>
                        <div className="profile-row-field">
                            <span>Call Credits</span>
                            <span className="profile-credits-badge">0</span>
                        </div>
                    </div>

                    {/* Subscriptions */}
                    <div className="profile-modal-card">
                        <div className="profile-card-header-action">
                            <h3>Subscriptions</h3>
                            <button
                                type="button"
                                className="profile-action-btn"
                                onClick={() => {
                                    handleReverseClose();
                                    setActivePage && setActivePage("upgrade");
                                }}
                            >
                                Buy Subscription →
                            </button>
                        </div>
                        <div className="profile-row-field disabled">
                            <span>No active subscription</span>
                        </div>
                    </div>

                    {/* Invoices */}
                    <div className="profile-modal-card">
                        <h3>Invoices</h3>
                        <div className="profile-row-field disabled">
                            <span>No invoices yet</span>
                        </div>
                    </div>

                    {/* Devices */}
                    <div className="profile-modal-card">
                        <div className="profile-card-header-action">
                            <h3>Devices</h3>
                            <button
                                type="button"
                                className="profile-secondary-btn"
                                onClick={handleSignOutAll}
                            >
                                Sign out all other devices
                            </button>
                        </div>
                        <p className="profile-field-hint">
                            Signs out every other browser and desktop app on your account. This device stays signed in.
                        </p>
                    </div>

                    {/* Delete Account */}
                    <div className="profile-modal-card delete-card">
                        <div className="profile-card-header-action">
                            <h3>Delete Account</h3>
                            <button
                                type="button"
                                className="profile-danger-btn"
                                onClick={handleDeleteAccount}
                            >
                                Delete Account
                            </button>
                        </div>
                        <p className="profile-field-hint">
                            Deleting your account will permanently remove all your data, credits, active subscriptions, and lifetime plans. This action is irreversible.
                        </p>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="profile-modal-footer">
                    <button
                        type="button"
                        className="profile-manage-billing-btn"
                        onClick={() => {
                            handleReverseClose();
                            setActivePage && setActivePage("upgrade");
                        }}
                    >
                        <FiCreditCard />
                        <span>Manage Billing</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;