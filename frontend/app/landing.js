export default function LandingPage() {
    return (
      <div className="landing-container">
        <div className="background">
          <img src="/path-to-your-collage.jpg" alt="LE SSERAFIM Collage" className="collage-background" />
        </div>
        
        <div className="icon-grid">
          <a href="/calls" className="icon">
            <div className="icon-image calls"></div>
            <p>Calls</p>
          </a>
          <a href="/messages" className="icon">
            <div className="icon-image messages"></div>
            <p>Messages</p>
          </a>
          <a href="/photos" className="icon">
            <div className="icon-image photos"></div>
            <p>Photos</p>
          </a>
          <a href="/calendar" className="icon">
            <div className="icon-image calendar"></div>
            <p>Calendar</p>
          </a>
          <a href="/podcast" className="icon">
            <div className="icon-image podcast"></div>
            <p>Podcast</p>
          </a>
          <a href="/settings" className="icon">
            <div className="icon-image settings"></div>
            <p>Settings</p>
          </a>
        </div>
      </div>
    );
  }
  