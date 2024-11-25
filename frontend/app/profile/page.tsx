'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";
import { ChevronLeft } from "lucide-react";
import bcrypt from 'bcryptjs';

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
  const { user, logout } = useContext(UserContext);
  const router = useRouter();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth?tab=login"); 
      return;
    }

    const getUserInfo = async () => {
      try {
        const query = `SELECT * FROM User WHERE Username = "${user.username}"`; 
        const response = await fetch(`/api/getRequest?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
          const userData = data[0];
          setUserInfo({
            username: userData.Username,
            email: userData.Email,
            membership: userData.MembershipStatus === 0 ? "Basic" : "Premium",
            location: userData.Location,
            password: "",
          });
          setNewUser(false);
        } else {
          setNewUser(true);
        }
      } catch (error) {
        console.error("Error fetching user info: ", error);
      } finally {
        setUserLoading(false);
      }
    };

    getUserInfo();
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    const getRegisterInfo = async () => {
      try {
        const query = `SELECT * FROM Register WHERE Username = "${user.username}"`;
        const response = await fetch(`/api/getRequest?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
          setRegister(
            data.map((event: any) => ({
              username: event.Username,
              eventid: event.EventID,
              registrationtime: event.RegistrationTime,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching registered events: ", error);
      } finally {
        setRegisterLoading(false);
      }
    };

    getRegisterInfo();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const getPreferencesInfo = async () => {
      try {
        const query = `SELECT * FROM ContentPreferences WHERE Username = "${user.username}"`;
        const response = await fetch(`/api/getRequest?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
          setPreferences(
            data.map((content: any) => ({
              username: content.Username,
              mediaid: content.MediaID,
              bias: content.Bias,
              eventname: content.EventName,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching content preferences: ", error);
      } finally {
        setContentLoading(false);
      }
    };

    getPreferencesInfo();
  }, [user]);

  const updateUserInfo = async () => {
    try {
      let query;
      let values;
      const hashedPassword = await bcrypt.hash(userInfo.password, 10);

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
          hashedPassword,
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
          hashedPassword,
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
        setMessage("Failed to update your information. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  const navigateToHome = () => {
    router.push("/");
  };

  const handleLogout = () => {
    logout(); // Call the logout function to clear user data
    router.push("/auth?tab=login"); // Redirect to the login page
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full px-4 lg:px-6 h-14 flex items-center justify-between bg-background border-b">
        <Button variant="ghost" className="text-sm font-medium flex items-center" onClick={() => router.push("/")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-2xl font-bold text-primary">Profile</h1>
        <Button variant="ghost" className="text-sm font-medium" onClick={handleLogout}>
          Log Out
        </Button>
      </header>
      <main className="flex-1 w-full py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6 space-y-8 max-w-3xl">
          {/* User Info */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["username", "email", "membership", "location", "password"].map((field, index) => (
                  <div key={index} className="space-y-2">
                    <label htmlFor={field} className="text-sm font-medium capitalize">
                      {field === "password" ? "Change Password" : field}
                    </label>
                    <Input
                      id={field}
                      name={field}
                      value={!userLoading && userInfo[field] ? userInfo[field] : ""}
                      placeholder={
                        userLoading
                          ? `Loading ${field}...`
                          : field === "password" 
                            ? `Enter your new password`
                            : `Enter your ${field}`
                      }
                      onChange={handleInputChange}
                      readOnly={(field === "username" || field === "membership") && !newUser}
                      className={!userLoading && userInfo[field] ? "" : "text-muted-foreground"}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={updateUserInfo} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
              {message && <p className="text-sm text-center mt-4 text-primary">{message}</p>}
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
                <p className="text-sm text-muted-foreground">Loading registered events...</p>
              ) : register.length === 0 ? (
                <p className="text-sm text-muted-foreground">No registered events available.</p>
              ) : (
                <div className="space-y-4">
                  {register.map((event, index) => (
                    <div key={index} className="p-4 border rounded-md bg-card">
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
                <p className="text-sm text-muted-foreground">Loading content preferences...</p>
              ) : preferences.length === 0 ? (
                <p className="text-sm text-muted-foreground">No content preferences available.</p>
              ) : (
                <div className="space-y-4">
                  {preferences.map((preference, index) => (
                    <div key={index} className="p-4 border rounded-md bg-card">
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
      <footer className="w-full py-6 px-4 md:px-6 border-t bg-background">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">© 2024 LePhoning. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}