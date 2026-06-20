/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import bishopMarkKariuki from './assets/images/Bishop DR. Mark Kariuki.jpg';
import bishopJBMasinde from './assets/images/Bishop Dr. JB Masinde.png';
import bishopGeorgeGichana from './assets/images/Bishop George Gichana.png';

import bishopPaulOselu from './assets/images/Bishop Paul Oselu.png';
import bishopSimonKaniaru from './assets/images/Bishop Simon Kaniaru.png';
import bishopJimmyKimani from './assets/images/Bishop Jimmy Kimani.png';

import bishopDominicMacharia from './assets/images/Bishop Dominic Macharia.png';
import pastorGeorgeSandy from './assets/images/George Mburu.png';

import pastorWilliamBittock from './assets/images/Pastor William Bittock.png';
import pastorSteveMungai from './assets/images/Pastor Steve Mungai.png';
import robertMwangi from './assets/images/Robert Mwangi.jpeg';



import hostJacksonLucy from './assets/images/Presiding Bishop Jackson & Reverend Lucy Kingori.png';

export interface ScheduleEvent {
  time: string;
  title: string;
  speaker?: string;
  location?: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  location?: string;
  imageUrl?: string;
}

export interface DaySchedule {
  date: string;
  dayLabel: string;
  theme?: string;
  events: ScheduleEvent[];
}

export interface HotelInfo {
  name: string;
  address: string;
  distance: string;
  rate: string;
  phone: string;
  bookingLink?: string;
}

export const SPEAKER_PROFILES = [
  {
    name: "Bishop Dr. Mark Kariuki",
    role: "Presiding Bishop, Deliverance Church International",
    location: "Kenya",
    description: "An anointed apostolic voice, Bishop Dr. Mark Kariuki leads thousands of churches globally. His teachings provoke deep revival, community impact, and multiplication of harvest. Known for his powerful apostolic anointing, his influence spans leadership, global media, and humanitarian ministries.",
  },
  {
    name: "Prof Lukas Njenga",
    role: "Conference Chair & Facilitator",
    location: "Dallas / UK",
    description: "Prof Lukas Njenga is a passionate leader committed to diaspora community development and apostolic alignment. Through academic leadership, city missions, and strategic networks, he chairs the Apostolic Impact 2026 initiative with a heart for city-wide and global transformation.",
  }
];

export const LEADERSHIP_TEAM: TeamMember[] = [
  { name: "Bishop Dr. Mark Kariuki", role: "Presiding Bishop", imageUrl: bishopMarkKariuki },
  { name: "Bishop JB Masinde", role: "Apostolic Bishop", imageUrl: bishopJBMasinde },
  { name: "Bishop George Gichana", role: "Apostolic Bishop", imageUrl: bishopGeorgeGichana },
  { name: "Bishop Jimmy Kimani", role: "Apostolic Bishop", imageUrl: bishopJimmyKimani },
  { name: "Bishop Simon Kaniaru", role: "Apostolic Bishop", imageUrl: bishopSimonKaniaru },
  { name: "Bishop Paul Oselu", role: "Apostolic Bishop", imageUrl: bishopPaulOselu }
];


export const CONFERENCE_HOSTS: TeamMember[] = [
  { 
    name: "Presiding Bishop Dr. Jackson & Dr. Reverend Lucy Kingori", 
    role: "Host Pastors, Neema Gospel Church",
    imageUrl: hostJacksonLucy
  }
];

import secretariatLukas from './assets/images/Bishop Prof Lukas Njenga Head of Secretariat & Marketplace Apostle.png';
import secretariatDorcas from './assets/images/Dorcas Karanja.png';
import secretariatKevin from './assets/images/Kelvin Kiragu.png';
import secretariatMichael from './assets/images/Michael Njenga.png';
import secretariatRuth from './assets/images/Ruth Chege.png';

// Newly inserted Secretariat team members
import secretariatGad from './assets/images/Gad Studio.png';
import secretariatEstherRailey from './assets/images/Place holder.png';
import secretariatJeremiah from './assets/images/Jeremiah Ngure.png';

export const SECRETARIAT_TEAM: TeamMember[] = [
  { name: "Prof Lukas Njenga", role: "Head of Secretariat / Marketplace Apostle", imageUrl: secretariatLukas },
  { name: "Pst. Gad", role: "Secretariat Team", imageUrl: secretariatGad },
  { name: "Rev. Esther Railey", role: "Secretariat Team", imageUrl: secretariatEstherRailey },
  { name: "Dorcas Karanja", role: "Events Director", imageUrl: secretariatDorcas },
  { name: "Kelvin Kiragu", role: "Commercial and Legal Director", imageUrl: secretariatKevin },
  { name: "Michael Njenga", role: "Chief Operations Director", imageUrl: secretariatMichael },
  { name: "Ruth Chege", role: "Efficiency and Productivity Director", imageUrl: secretariatRuth },

  { name: "Jeremiah Ngure", role: "Secretariat Team", imageUrl: secretariatJeremiah }
];



export const INTERCESSION_TEAM: TeamMember[] = [
  { name: "Bishop Dominic Macharia", role: "Additional Bishop Support", imageUrl: bishopDominicMacharia },
  { name: "Pastor William Bittock", role: "LOCAL PASTORAL SUPPORT", imageUrl: pastorWilliamBittock },
  { name: "Pastor Stephen Mungai", role: "LOCAL PASTORAL SUPPORT", imageUrl: pastorSteveMungai },

  { name: "Pastor Robert Mwangi", role: "LOCAL PASTORAL SUPPORT", imageUrl: robertMwangi },
  { name: "Pastor George Mburu", role: "LOCAL PASTORAL SUPPORT", imageUrl: pastorGeorgeSandy }
];




export const CONFERENCE_SCHEDULE: DaySchedule[] = [
  {
    date: "2026-09-24",
    dayLabel: "Thursday, Sept 24",
    theme: "Opening & Registration",
    events: [
      {
        time: "04:00 PM",
        title: "Registration",
        description: "Pick up conference badges and delegate bags."
      },
      {
        time: "06:00 PM",
        title: "Opening Ceremony",
        description: "A powerful evening of worship and apostolic decree."
      }
    ]
  },
  {
    date: "2026-09-25",
    dayLabel: "Friday, Sept 25",
    theme: "Impact & Impartation",
    events: [
      { time: "10:00 AM", title: "Praise & Worship", description: "Enthroning the King." },
      { time: "11:00 AM", title: "Plenary Session", description: "Apostolic insights for the hour." },
      { time: "12:30 PM", title: "Lunch Break", description: "Fellowship and networking." },
      { time: "02:30 PM", title: "Workshops & Masterclasses", description: "Practical tools for marketplace and ministry." },
      { time: "04:00 PM", title: "Break", description: "" },
      { time: "04:30 PM", title: "Workshops Continued", description: "Deeper dives into impact areas." },
      { time: "05:30 PM", title: "Break", description: "" },
      { time: "06:30 PM - 09:00 PM", title: "Evening Plenary", description: "Prophetic impartation and revival fire." }
    ]
  },
  {
    date: "2026-09-26",
    dayLabel: "Saturday, Sept 26",
    theme: "Empowerment & Networking",
    events: [
      { time: "10:00 AM", title: "Praise & Worship", description: "" },
      { time: "11:00 AM", title: "Plenary Session", description: "" },
      { time: "12:30 PM", title: "Lunch Break", description: "" },
      { time: "02:30 PM", title: "Workshops & Masterclasses", description: "" },
      { time: "04:00 PM", title: "Break", description: "" },
      { time: "04:30 PM", title: "Workshops", description: "" },
      { time: "05:30 PM", title: "Break", description: "" },
      { time: "06:30 PM - 09:00 PM", title: "Evening Plenary", description: "" }
    ]
  },
  {
    date: "2026-09-27",
    dayLabel: "Sunday, Sept 27",
    theme: "Awards & Closing Ceremony",
    events: [
      { time: "04:00 PM", title: "Closing Ceremony", description: "Official commissioning of delegates." },
      { time: "06:30 PM", title: "Dinner & Awards Night", description: "Gala dinner and Apostolic Recognition Awards." }
    ]
  }
];

export const HOTELS: HotelInfo[] = [
  {
    name: "Hilton Garden Inn Dallas/Allen",
    address: "Bishops Recommended",
    distance: "5.2 miles from Venue",
    rate: "Special Rate Negotiated",
    phone: "+1 (214) 547-1700",
    bookingLink: "https://www.hilton.com"
  },
  {
    name: "Holiday Inn Express Dallas",
    address: "Delegates Recommended",
    distance: "4.5 miles from Venue",
    rate: "Special Rate Negotiated",
    phone: "+1 (972) 241-8500",
    bookingLink: "https://www.ihg.com"
  }
];

export const PROMO_CODES: { [key: string]: number } = {
  "DOUBLE2026": 0.20, // 20% off
  "HARVEST": 0.15,    // 15% off
  "DIASPORA": 0.10,   // 10% off
  "VIPEARLY": 0.25,   // 25% off
  "FREEPASS": 1.00    // 100% off (Free VIP/Standard)
};
