import { useEffect, useState } from "react";
import { getUserProfile } from "../utilities";
import ProfileCard from "../components/ProfileCard";
import ProfileDetails from "../components/ProfileDetails";
import WishlistList from "../components/WishlistList";
import CommentList from "../components/CommentList";
import TicketList from "../components/TicketList";

function UserProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getUserProfile().then((data) => setProfile(data));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <ProfileCard profile={profile} />
      <ProfileDetails profile={profile} />

      <div>
        <h2 className="text-xl font-bold mb-2">Wishlists</h2>
        <WishlistList items={profile.event_wishlists} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Comments</h2>
        <CommentList items={profile.comments} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Tickets</h2>
        <TicketList items={profile.tickets} />
      </div>
    </div>
  );
}

export default UserProfile;
