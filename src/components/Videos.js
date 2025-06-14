import React from "react";

function Videos() {
  // Replace with your actual YouTube embed links
  return (
    <div className="container py-5" style={{ marginTop: 100 }}>
      <h2 className="mb-4 text-white">Videos</h2>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="ratio ratio-16x9">
            <iframe
              src="https://www.youtube.com/embed/XXXXXXXXXXX"
              title="Drum Sircle Video 1"
              allowFullScreen
              frameBorder={0}
            />
          </div>
        </div>
        {/* Add more videos as needed */}
      </div>
    </div>
  );
}
export default Videos;
