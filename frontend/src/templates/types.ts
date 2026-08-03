export interface SectionData {
  id: string;
  type: string;
  title: string;
  content: string;
  visible: boolean;
}

export interface TemplateData {
  name: string;
  slug: string;
  message?: string | null;
  sections: SectionData[];
  eventTitle: string;
  eventTagline: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  timezone: string;
  venueName: string;
  venueAddress: string;
  venueNote: string;
  hostPrimaryName: string;
  hostPartnerName: string;
  guestName?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  headingFont: string;
  bodyFont: string;
}
