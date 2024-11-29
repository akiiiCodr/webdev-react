import React, { useState } from 'react';

function Admin() {
  const [activeContent, setActiveContent] = useState('content1');

  const showContent = (contentId) => {
    setActiveContent(contentId);
  };

  return (
    <>
      {/* Left Sidebar */}
      <div className="left-sidebar">
        <div className="rectangle" onClick={() => showContent('content1')}>Tenants</div>
        <div className="rectangle" onClick={() => showContent('content2')}>Payments</div>
        <div className="rectangle" onClick={() => showContent('content3')}>Contracts</div>
        <div className="rectangle" onClick={() => showContent('content4')}>Informations</div>
      </div>
      {/* Content Viewer beside Sidebar */}
      <div className="content-viewer">
        <div
          id="content1"
          className={`viewer-content ${activeContent === 'content1' ? 'active' : ''}`}
        >
          List of Tenants
        </div>
        <div
          id="content2"
          className={`viewer-content ${activeContent === 'content2' ? 'active' : ''}`}
        >
          Payments
        </div>
        <div
          id="content3"
          className={`viewer-content ${activeContent === 'content3' ? 'active' : ''}`}
        >
          Contracts
        </div>
        <div
          id="content4"
          className={`viewer-content ${activeContent === 'content4' ? 'active' : ''}`}
        >
          Informations
        </div>
      </div>
    </>
  );
}

export default Admin;
