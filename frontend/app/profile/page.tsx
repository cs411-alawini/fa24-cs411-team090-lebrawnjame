'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type UserInfo = {
  [key: string]: string;
  username: string;
  email: string;
  membership: string;
  location: string;
  password: string;
};

interface Register {
  username: string;
  eventid: string;
  registrationtime: string;
}

interface Preferences {
  username: string;
  mediaid: string;
  bias: string;
  eventname: string;
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    email: "",
    membership: "",
    location: "",
    password: "",
  });

  const [register, setRegister] = useState<Register[]>([]);
  const [preferences, setPreferences] = useState<Preferences[]>([]);

  const [message, setMessage] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [newUser, setNewUser] = useState(true);

  const router = useRouter(); // Initialize useRouter

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        let query = 'SELECT * FROM User WHERE Username = "abhi5"';
        const response = await fetch(`/api/getRequest?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
          const user = data[0];
          setUserInfo({
            username: user.Username,
            email: user.Email,
            membership: user.MembershipStatus,
            location: user.Location,
            password: user.Password,
          });
          setNewUser(false);
        } else {
          setNewUser(true);
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
      } finally {
        setUserLoading(false);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    const getRegisterInfo = async () => {
      try {
        let query = 'SELECT * FROM Register WHERE Username = "abhi5"';
        const response = await fetch(`/api/getRequest?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
          setRegister(data[0].map((event: any) => ({
            username: event.Username,
            eventid: event.EventID,
            registrationtime: event.RegistrationTime,
          })));
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setRegisterLoading(false);
      }
    };

    getRegisterInfo();
  }, []);

  useEffect(() => {
    const getPreferencesInfo = async () => {
      try {
        let query = 'SELECT * FROM ContentPreferences WHERE Username = "abhi5"';
        const response = await fetch(`/api/getRequest?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
          setPreferences(data[0].map((content: any) => ({
            username: content.Username,
            mediaid: content.MediaID,
            bias: content.Bias,
            eventname: content.EventName,
          })));
        }
      } catch (error) {
        console.error("Error fetching preferences: ", error);
      } finally {
        setContentLoading(false);
      }
    };

    getPreferencesInfo();
  }, []);


  const updateUserInfo = async () => {
    try {
      let query;
      let values;
  
      if (newUser) {
        query = `
          INSERT INTO User (Username, Email, MembershipStatus, Location, Password) 
          VALUES (?, ?, ?, ?, ?)
        `;
        values = [
          userInfo.username,
          userInfo.email,
          userInfo.membership,
          userInfo.location,
          userInfo.password,
        ];
      } else {
        query = `
          UPDATE User 
          SET Email = ?, MembershipStatus = ?, Location = ?, Password = ? 
          WHERE Username = ?
        `;
        values = [
          userInfo.email,
          userInfo.membership,
          userInfo.location,
          userInfo.password,
          userInfo.username,
        ];
      }
  
      const response = await fetch('/api/postRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, values }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setMessage("Your information has been successfully updated!");
        console.log("Update result:", data);
      } else {
        const errorData = await response.json();
        setMessage("Failed to update your information. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  const navigateToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full px-4 lg:px-6 h-14 flex items-center justify-between bg-white">
        <h1 className="text-2xl font-bold text-pink-500">Profile</h1>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-sm font-medium" onClick={navigateToHome}>
            Back to Home
          </Button>
          <Button variant="ghost" className="text-sm font-medium">Log Out</Button>
        </div>
      </header>
      <main className="flex-1 w-full py-12 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6 space-y-8">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["username", "email", "membership", "location", "password"].map((field, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-center gap-4">
                    <label className="text-sm font-medium w-full md:w-1/4 capitalize">{field}</label>
                    <Input
                      name={field}
                      type={field === "password" ? "password" : "text"}
                      value={!userLoading && userInfo[field] ? userInfo[field] : ""}
                      placeholder={
                        userLoading
                          ? `Loading ${field}...`
                          : `Enter your ${field}`
                      }
                      onChange={handleInputChange}
                      readOnly={field === "username" && !newUser}
                      className={!userLoading && userInfo[field] ? "text-black" : "text-gray-400"}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button className="bg-pink-500 text-white hover:bg-pink-600" onClick={updateUserInfo}>
                  Save Changes
                </Button>
              </div>
              {message && <p className="text-sm text-center mt-4 text-pink-500">{message}</p>}
            </CardContent>
          </Card>

          {/* Events */}
          <Card>
            <CardHeader>
              <CardTitle>Your Registered Events</CardTitle>
              <CardDescription>View your event registrations</CardDescription>
            </CardHeader>
            <CardContent>
              {registerLoading ? (
                <p className="text-sm text-gray-500">Loading registered events...</p>
              ) : register.length === 0 ? (
                <p className="text-sm text-gray-500">No registered events available.</p>
              ) : (
                <div className="space-y-4">
                  {register.map((event, index) => (
                    <div key={index} className="p-4 border rounded-md bg-white">
                      <p><span className="font-medium">Event ID:</span> {event.eventid}</p>
                      <p><span className="font-medium">Registration Time:</span> {event.registrationtime}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Your Content Preferences</CardTitle>
              <CardDescription>Manage your favorite content</CardDescription>
            </CardHeader>
            <CardContent>
              {contentLoading ? (
                <p className="text-sm text-gray-500">Loading content preferences...</p>
              ) : preferences.length === 0 ? (
                <p className="text-sm text-gray-500">No content preferences available.</p>
              ) : (
                <div className="space-y-4">
                  {preferences.map((preference, index) => (
                    <div key={index} className="p-4 border rounded-md bg-white">
                      <p><span className="font-medium">Media ID:</span> {preference.mediaid}</p>
                      <p><span className="font-medium">Bias:</span> {preference.bias}</p>
                      <p><span className="font-medium">Event Name:</span> {preference.eventname}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="w-full py-6 px-4 md:px-6 border-t bg-white">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">© 2024 LePhoning. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}