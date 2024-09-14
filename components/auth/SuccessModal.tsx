// components/auth/SuccessModal.tsx
import React from 'react';

export const SuccessModal = () => {
    return (
        <div className="modal fade show" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Account Created Successfully!</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Your account has been created successfully! You can now log in to access our services.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-dismiss="modal">
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};