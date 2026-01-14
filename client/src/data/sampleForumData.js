// Sample data for forum development

export const sampleConventions = [
  {
    id: 1,
    year: 2026,
    name: "FalCON",
    startDate: "August 14, 2026",
    endDate: "August 16, 2026",
    location: "Lake Harmony, PA",
    address: "96 Wolf Hollow Rd, Lake Harmony, PA 18624",
    isActive: true,
    eventCount: 12,
    discussionCount: 47,
  },
  {
    id: 2,
    year: 2025,
    name: "FalCON",
    startDate: "August 14, 2025",
    endDate: "August 16, 2025",
    location: "Lake Harmony, PA",
    address: "96 Wolf Hollow Rd, Lake Harmony, PA 18624",
    isActive: false,
    eventCount: 10,
    discussionCount: 89,
  },
  {
    id: 3,
    year: 2024,
    name: "FalCON",
    startDate: "August 15, 2024",
    endDate: "August 17, 2024",
    location: "Lake Harmony, PA",
    address: "96 Wolf Hollow Rd, Lake Harmony, PA 18624",
    isActive: false,
    eventCount: 8,
    discussionCount: 124,
  },
];

export const sampleEventsByDay = {
  2026: {
    "Day I - August 14th": [
      {
        id: 1,
        title: "Opening Ceremony",
        day: "2026-08-14",
        start_time: "10:00 AM",
        end_time: "11:30 AM",
        location: "Main Hall",
        description: "Join us as we kick off FalCON 2026! Meet your fellow adventurers, hear announcements about the weekend's events, and participate in our traditional dice-rolling ceremony. All attendees receive a commemorative d20 and event program.",
        commentCount: 8,
      },
      {
        id: 2,
        title: "Welcome Feast",
        day: "2026-08-14",
        start_time: "12:00 PM",
        end_time: "2:00 PM",
        location: "Tavern",
        description: "Gather around the table for a hearty meal fit for heroes. Meet your fellow adventurers and share tales of past campaigns.",
        commentCount: 3,
      },
      {
        id: 3,
        title: "Dragon's Lair: Session Zero",
        day: "2026-08-14",
        start_time: "2:00 PM",
        end_time: "6:00 PM",
        location: "Gaming Hall A",
        description: "Create your character and learn the basics of our weekend-long campaign. New players welcome!",
        commentCount: 12,
      },
      {
        id: 4,
        title: "Tavern Games Night",
        day: "2026-08-14",
        start_time: "8:00 PM",
        end_time: "11:00 PM",
        location: "Tavern",
        description: "Unwind with card games, dice games, and friendly competition. Prizes for tournament winners!",
        commentCount: 5,
      },
    ],
    "Day II - August 15th": [
      {
        id: 5,
        title: "Dragon's Lair: Part One",
        day: "2026-08-15",
        start_time: "9:00 AM",
        end_time: "1:00 PM",
        location: "Gaming Hall A",
        description: "The adventure begins! Your party sets out on their quest.",
        commentCount: 7,
      },
      {
        id: 6,
        title: "Crafting Workshop: Leather Armor",
        day: "2026-08-15",
        start_time: "10:00 AM",
        end_time: "12:00 PM",
        location: "Workshop",
        description: "Learn the basics of leatherworking and create your own bracers to take home.",
        commentCount: 4,
      },
      {
        id: 7,
        title: "Potion Mixing Class",
        day: "2026-08-15",
        start_time: "2:00 PM",
        end_time: "4:00 PM",
        location: "Tavern",
        description: "Our mixologists teach you to create magical cocktails and mocktails.",
        commentCount: 9,
      },
      {
        id: 8,
        title: "Dragon's Lair: Part Two",
        day: "2026-08-15",
        start_time: "4:00 PM",
        end_time: "8:00 PM",
        location: "Gaming Hall A",
        description: "The plot thickens as your party faces new challenges.",
        commentCount: 6,
      },
      {
        id: 9,
        title: "Costume Contest",
        day: "2026-08-15",
        start_time: "9:00 PM",
        end_time: "11:00 PM",
        location: "Main Hall",
        description: "Show off your best cosplay! Categories include Best Armor, Most Creative, and Best Group.",
        commentCount: 15,
      },
    ],
    "Day III - August 16th": [
      {
        id: 10,
        title: "Dragon's Lair: Finale",
        day: "2026-08-16",
        start_time: "9:00 AM",
        end_time: "2:00 PM",
        location: "Gaming Hall A",
        description: "The epic conclusion to our weekend campaign. Will your party succeed?",
        commentCount: 11,
      },
      {
        id: 11,
        title: "Merchant's Market",
        day: "2026-08-16",
        start_time: "10:00 AM",
        end_time: "3:00 PM",
        location: "Courtyard",
        description: "Browse handcrafted goods, rare collectibles, and exclusive FalCON merchandise.",
        commentCount: 2,
      },
      {
        id: 12,
        title: "Closing Ceremony",
        day: "2026-08-16",
        start_time: "4:00 PM",
        end_time: "5:30 PM",
        location: "Main Hall",
        description: "Join us as we bid farewell to another amazing FalCON. Awards, announcements, and a sneak peek at next year!",
        commentCount: 6,
      },
    ],
  },
};

export const sampleComments = [
  {
    id: 1,
    author: "DungeonMaster_Mike",
    authorId: 101,
    isAdmin: true,
    time: "2 hours ago",
    text: "Excited to announce we'll have a special guest this year at the opening ceremony! Can't reveal who yet, but trust me - you won't want to miss this.",
    likes: [102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113],
    replies: [
      {
        id: 2,
        author: "RogueKnight42",
        authorId: 102,
        isAdmin: false,
        time: "1 hour ago",
        text: "THE HYPE IS REAL! Is it Matt Mercer?? Please tell me it's Matt Mercer!",
        likes: [101, 103, 104, 105, 106],
        replies: [
          {
            id: 3,
            author: "DungeonMaster_Mike",
            authorId: 101,
            isAdmin: true,
            time: "45 minutes ago",
            text: "My lips are sealed! 🤐 But I will say... you might want to bring your Player's Handbook for autographs.",
            likes: [102, 103, 104],
            replies: [],
          },
        ],
      },
      {
        id: 4,
        author: "WizardOfOz",
        authorId: 103,
        isAdmin: false,
        time: "30 minutes ago",
        text: "I'm freaking out right now! This is going to be the best FalCON yet!",
        likes: [101, 102],
        replies: [],
      },
    ],
  },
  {
    id: 5,
    author: "ElfWizard_Luna",
    authorId: 104,
    isAdmin: false,
    time: "5 hours ago",
    text: "First time attending FalCON and I'm SO nervous! Any tips for newbies? Also, is there assigned seating or first-come-first-serve?",
    likes: [101, 105, 106],
    replies: [
      {
        id: 6,
        author: "VeteranPaladin",
        authorId: 105,
        isAdmin: false,
        time: "4 hours ago",
        text: "Welcome to the party! Don't worry, everyone is super friendly here. Seating is first-come-first-serve, but there's always room. Pro tip: bring snacks and comfortable shoes!",
        likes: [104, 101],
        replies: [],
      },
    ],
  },
  {
    id: 7,
    author: "BarbarianBob",
    authorId: 106,
    isAdmin: false,
    time: "Yesterday",
    text: "Will there be coffee available this early? Some of us are rolling with a -2 to initiative before caffeine.",
    likes: [101, 102, 103, 104, 105, 107, 108, 109],
    replies: [],
  },
];

export const generalDiscussionData = {
  title: "The Tavern",
  description: "General discussion, questions & announcements",
  discussionCount: 23,
};

// Helper to get convention by year
export const getConventionByYear = (year) => {
  return sampleConventions.find((c) => c.year === parseInt(year));
};

// Helper to get events for a convention year
export const getEventsByYear = (year) => {
  return sampleEventsByDay[year] || {};
};

// Helper to get event by ID
export const getEventById = (eventId) => {
  for (const year of Object.keys(sampleEventsByDay)) {
    for (const day of Object.keys(sampleEventsByDay[year])) {
      const event = sampleEventsByDay[year][day].find(
        (e) => e.id === parseInt(eventId)
      );
      if (event) return { ...event, conventionYear: parseInt(year) };
    }
  }
  return null;
};
