export const BASE_URL = 'http://localhost:3000';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const fetchInternships = async () => {
  console.log('Fetching internships from backend...');
  const response = await fetch(`${BASE_URL}/internships`);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`);
  }
  const data = await response.json();
  console.log('Internships received:', data);
  return data;
};

export const fetchHackathons = async () => {
  console.log('Fetching hackathons from backend...');
  const response = await fetch(`${BASE_URL}/hackathons`);

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('Hackathons received:', data);

  return data;
};



export const fetchMatchingHackathons = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch(
      `${BASE_URL}/matching_hackathons`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching matching hackathons:", error);
    throw error;
  }
};


export const fetchMatchingInternships = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch("http://localhost:3000/matching_internships", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching matching internships:", error);
    throw error;
  }
};
