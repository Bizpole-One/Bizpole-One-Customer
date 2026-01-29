// Event types with different colors
export const EVENT_TYPES = {
  MEETING: {
    name: "Meeting",
    color: "bg-amber-100",
    border: "border-l-amber-400",
    text: "text-amber-800",
    icon: "MEETING"
  },
  PRESENTATION: {
    name: "Presentation",
    color: "bg-blue-100",
    border: "border-l-blue-400",
    text: "text-blue-800",
    icon: "PRESENTATION"
  },
  TEAM: {
    name: "Team Event",
    color: "bg-purple-100",
    border: "border-l-purple-400",
    text: "text-purple-800",
    icon: "TEAM"
  },
  PERSONAL: {
    name: "Personal",
    color: "bg-green-100",
    border: "border-l-green-400",
    text: "text-green-800",
    icon: "PERSONAL"
  }
};

// Meeting types
export const MEETING_TYPES = {
  IN_PERSON: { name: "In Person", icon: "IN_PERSON" },
  VIDEO: { name: "Video Call", icon: "VIDEO" },
  PHONE: { name: "Phone Call", icon: "PHONE" }
};

// Sample events
export const initialEvents = [
  {
    id: 1,
    title: "Meeting with CEO",
    start: new Date(2045, 4, 8, 10, 0),
    end: new Date(2045, 4, 8, 13, 0),
    type: "MEETING",
    meetingType: "IN_PERSON",
    description: "Quarterly performance review and strategy discussion for next fiscal year.",
    location: "Conference Room A",
    attendees: ["John CEO", "Sarah VP", "Michael Director", "Emily Manager"],
    color: "bg-amber-100",
    priority: "High",
    days: ["Mon", "Wed"],
    repeat: false
  },
  {
    id: 2,
    title: "Product Launch Presentation",
    start: new Date(2045, 4, 8, 14, 0),
    end: new Date(2045, 4, 8, 16, 0),
    type: "PRESENTATION",
    meetingType: "VIDEO",
    description: "Launching the new product line to regional teams.",
    location: "Online - Teams Meeting",
    attendees: ["Product Team", "Marketing Department", "Regional Managers"],
    color: "bg-blue-100",
    priority: "Medium",
    days: ["Tue"],
    repeat: true
  },
  {
    id: 3,
    title: "Service Team Sync",
    start: new Date(2045, 4, 16, 9, 0),
    end: new Date(2045, 4, 16, 11, 0),
    type: "TEAM",
    meetingType: "VIDEO",
    description: "Weekly sync on customer issues and resolution strategies.",
    location: "Online - Zoom",
    attendees: ["Support Team", "Engineering Leads", "QA Team"],
    color: "bg-purple-100",
    priority: "Low",
    days: ["Fri"],
    repeat: false
  },
  {
    id: 4,
    title: "GST Team Strategy",
    start: new Date(2045, 4, 28, 11, 0),
    end: new Date(2045, 4, 28, 14, 0),
    type: "TEAM",
    meetingType: "IN_PERSON",
    description: "Global strategy discussion for market expansion.",
    location: "Main Board Room",
    attendees: ["Regional Managers", "Operations Team", "Finance Department"],
    color: "bg-purple-100",
    priority: "Medium",
    days: ["Thu"],
    repeat: true
  },
  {
    id: 5,
    title: "Lunch with Client",
    start: new Date(2045, 4, 22, 12, 0),
    end: new Date(2045, 4, 22, 13, 30),
    type: "MEETING",
    meetingType: "IN_PERSON",
    description: "Discuss partnership opportunities over lunch.",
    location: "The Grand Restaurant",
    attendees: ["Client CEO", "Client CTO", "Our Account Team"],
    color: "bg-amber-100",
    priority: "High",
    days: ["Mon", "Thu"],
    repeat: false
  }
];