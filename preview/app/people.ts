// Made-up people and places for the preview.
export type Person = { first: string; last: string; place?: string; role?: string; status?: string; former?: boolean };

export const PEOPLE: Person[] = [
  { first: "Ana", last: "López", place: "Mexico City", role: "Board member" },
  { first: "Tomás", last: "Herrera", place: "Buenos Aires" },
  { first: "Mira", last: "Okafor", place: "London", role: "Ambassador" },
  { first: "Jonas", last: "Lindqvist", place: "Copenhagen" },
  { first: "Priya", last: "Raman" },
  { first: "Lea", last: "Brandt", place: "Berlin" },
  { first: "Kenji", last: "Watanabe", place: "Tokyo" },
  { first: "Sofía", last: "Castellanos-Villanueva", place: "Bogotá" },
  { first: "Omar", last: "Haddad", place: "Amman", role: "Admin" },
  { first: "Ruth", last: "Abebe", place: "Nairobi" },
  { first: "Daniel", last: "Ortega", place: "Lisbon", status: "Left in 2024", former: true },
  { first: "Chloé", last: "Martin", place: "Paris" },
];

export const HUBS = ["Amman", "Amsterdam", "Athens", "Bangalore", "Barcelona", "Beijing", "Berlin", "Bogotá", "Boston", "Brussels", "Buenos Aires", "Cairo"];
