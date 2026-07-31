export interface UpcomingEvent {
  day: string;
  month: string;
  title: string;
  location: string;
  daysLeft: string;
  time: string;
  description: string;
  image: string;
}

export interface PreviousEvent {
  title: string;
  date: string;
  image: string;
  category: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface StoreLocation {
  id: string;
  address: string;
  zone: string;
  contract: string;
}

export const upcomingEvents: UpcomingEvent[] = [];
export const previousEvents: PreviousEvent[] = [];
export const galleryImages: GalleryImage[] = [];
export const storeLocations: StoreLocation[] = [
  {
    id: "01",
    address: "House 45, Road 11, Block H, Banani, Dhaka - 1213",
    zone: "Dhaka, Banani",
    contract: "+880 1735-494949",
  }
];
