/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScheduleEvent {
  time: string;
  title: string;
  speaker?: string;
  location?: string;
  description: string;
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

export const CONFERENCE_SCHEDULE: DaySchedule[] = [
  {
    date: "2026-09-24",
    dayLabel: "Thursday, Sept 24",
    theme: "Day of Consecration & Apostolic Alignment",
    events: [
      {
        time: "09:00 AM - 11:30 AM",
        title: "Registration & Ground Gates Open",
        location: "Main Foyer - Neema Gospel Church",
        description: "Pick up conference badges, delegate bags, schedules, and attend the welcome reception."
      },
      {
        time: "02:00 PM - 04:30 PM",
        title: "Apostolic Alignment: Afternoon Symposium",
        speaker: "Prof Lukas Njenga",
        location: "Chapel Hall",
        description: "A specialized briefing session setting the standard, focus, and core foundations for AIC Dallas 2026."
      },
      {
        time: "06:30 PM - 09:30 PM",
        title: "Opening Keynote: Double Your Impact, Multiply Your Harvest",
        speaker: "Bishop Dr. Mark Kariuki",
        location: "Main Sanctuary",
        description: "A powerful evening of expressive praise, prophetic decree, and introduction to the Year of Double Harvest."
      }
    ]
  },
  {
    date: "2026-09-25",
    dayLabel: "Friday, Sept 25",
    theme: "Preaching power, Workshops & Breakouts",
    events: [
      {
        time: "09:00 AM - 12:00 PM",
        title: "Morning Glory & Leadership Masterclass",
        speaker: "Bishop Dr. Mark Kariuki",
        location: "Main Sanctuary",
        description: "Core apostolic principles of church planting, team-building, and organizational development in the diaspora context."
      },
      {
        time: "01:30 PM - 04:30 PM",
        title: "Specialized Breakouts & Workshops",
        location: "Breakout Rooms A & B",
        description: "Sessions include: 1. Marketplace Ministry (Doubling business impact) 2. Next-Gen Christian Leaders 3. Consular Integration and Visa Pathways."
      },
      {
        time: "06:30 PM - 09:30 PM",
        title: "Friday Evening Revival: Unleashing Pentecostal Fire",
        speaker: "Bishop Dr. Mark Kariuki & Guest Worship Teams",
        location: "Main Sanctuary",
        description: "Expect powerful deliverance, laying on of hands, and release of fresh apostolic mantles."
      }
    ]
  },
  {
    date: "2026-09-26",
    dayLabel: "Saturday, Sept 26",
    theme: "Empowerment & Diaspora Impact Initiatives",
    events: [
      {
        time: "09:00 AM - 12:00 PM",
        title: "Empowerment Masterclass: Global Citizenship",
        speaker: "Prof Lukas Njenga & Dynamic Leaders",
        location: "Chapel Hall",
        description: "Strategies on building social proof networks, wealth generation structures, and supporting family networks in Kenya/diaspora."
      },
      {
        time: "02:00 PM - 05:00 PM",
        title: "Diaspora Business Forum & Matchmaking",
        location: "Main Pavilion",
        description: "Exhibitions, elevator pitches, and strategic networking for investors, church entities, and local entrepreneurs."
      },
      {
        time: "06:30 PM - 09:30 PM",
        title: "Saturday Evening Miracle Service",
        speaker: "Bishop Dr. Mark Kariuki & Evangelical Vocalists",
        location: "Main Sanctuary",
        description: "A dedicated healing service. Come expecting apostolic restoration, miracles, and the absolute goodness of God."
      }
    ]
  },
  {
    date: "2026-09-27",
    dayLabel: "Sunday, Sept 27",
    theme: "Apostolic Commissioning & Closing Gala",
    events: [
      {
        time: "09:30 AM - 01:00 PM",
        title: "Sunday Celebration Worship & Commissioning Service",
        speaker: "Bishop Dr. Mark Kariuki",
        location: "Main Sanctuary",
        description: "Global worship celebration with united chancel choirs, corporate communion, and official commissioning of delegates."
      },
      {
        time: "06:00 PM - 09:30 PM",
        title: "2026 Conference Closing & Gala Dinner",
        speaker: "Prof Lukas Njenga & Honored Guests",
        location: "Grand Banquet Hall",
        description: "The grand finale of AIC 2026. A formal evening of celebration, fellowship, and special musical guests to mark the successful conclusion of the conference."
      }
    ]
  }
];

export const HOTELS: HotelInfo[] = [
  {
    name: "Hilton Garden Inn Dallas/Allen",
    address: "705 Central Expy S, Allen, TX 75013",
    distance: "5.2 miles from Venue (approx 10 mins)",
    rate: "$119 / night (AIC Special Rate)",
    phone: "+1 (214) 547-1700",
    bookingLink: "https://www.hilton.com"
  },
  {
    name: "Courtyard by Marriott Dallas Plano/Allen",
    address: "210 East Stacy Road, Allen, TX 75002",
    distance: "6.1 miles from Venue (approx 12 mins)",
    rate: "$129 / night (Shuttle included)",
    phone: "+1 (214) 383-1151",
    bookingLink: "https://www.marriott.com"
  },
  {
    name: "La Quinta Inn & Suites by Wyndham Allen",
    address: "1220 N Central Expy, Allen, TX 75013",
    distance: "4.8 miles from Venue",
    rate: "$89 / night (Budget friendly)",
    phone: "+1 (214) 667-6000",
    bookingLink: "https://www.wyndhamhotels.com"
  }
];

export const PROMO_CODES: { [key: string]: number } = {
  "DOUBLE2026": 0.20, // 20% off
  "HARVEST": 0.15,    // 15% off
  "DIASPORA": 0.10,   // 10% off
  "VIPEARLY": 0.25,   // 25% off
  "FREEPASS": 1.00    // 100% off (Free VIP/Standard)
};
