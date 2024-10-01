import Image from 'next/image';
import Link from 'next/link';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <div className="background">
      <Image src="/assets/lephoningbackground.png" alt="LE SSERAFIM Collage" fill className="collage-background" />
      </div>
      
      <div className="icon-grid">
        <Link href="/calls" className="icon">
          <div className="icon-image calls"></div>
          <p>Calls</p>
        </Link>
        <Link href="/messages" className="icon">
          <div className="icon-image messages"></div>
          <p>Messages</p>
        </Link>
        <Link href="/photos" className="icon">
          <div className="icon-image photos"></div>
          <p>Photos</p>
        </Link>
        <Link href="/calendar" className="icon">
          <div className="icon-image calendar"></div>
          <p>Calendar</p>
        </Link>
        <Link href="/podcast" className="icon">
          <div className="icon-image podcast"></div>
          <p>Podcast</p>
        </Link>
        <Link href="/settings" className="icon">
          <div className="icon-image settings"></div>
          <p>Settings</p>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
