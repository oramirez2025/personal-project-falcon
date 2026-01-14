// Shared config for convention details used across components
export const CONVENTION = {
  name: "FalCON",
  startDate: new Date(2026, 7, 14), // August 14, 2026 (month is 0-indexed)
  endDate: new Date(2026, 7, 16, 23, 59, 59), // August 16, 2026 end of day
  year: "2026",
  address: "96 Wolf Hollow Rd",
  city: "Lake Harmony",
  state: "PA",
  zip: "18624",
}

// For display
export const CONVENTION_DATES = {
  startDisplay: "August 14",
  endDisplay: "August 16",
  fullRange: "August 14 - August 16, 2026",
}