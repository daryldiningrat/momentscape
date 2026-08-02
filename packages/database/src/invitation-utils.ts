export interface InvitationSection {
  type: "hero" | "details" | "rsvp" | "gallery" | "custom";
  title?: string;
  content?: string;
  order: number;
  metadata?: Record<string, unknown>;
}

export interface InvitationDesign {
  colors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fonts?: {
    heading: string;
    body: string;
  };
  templateId?: string;
}

export interface CmsEventData {
  title: string;
  tagline: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  timezone: string;
}

export interface CmsVenueData {
  name: string;
  address: string;
  mapLink: string;
  note: string;
}

export interface CmsHostData {
  primaryName: string;
  primaryPhoto: string;
  partnerName: string;
  partnerPhoto: string;
  contactEmail: string;
  contactPhone: string;
}

export interface CmsData {
  event?: CmsEventData;
  venue?: CmsVenueData;
  host?: CmsHostData;
}

export function validateInvitation(data: {
  name?: string;
  slug?: string;
  sections?: InvitationSection[];
  design?: InvitationDesign;
  cmsData?: CmsData;
}) {
  const errors: string[] = [];

  if (data.name !== undefined) {
    if (!data.name || data.name.length < 1) errors.push("Name is required");
    if (data.name.length > 200) errors.push("Name must be 200 characters or fewer");
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push("Slug must contain only lowercase letters, numbers, and hyphens");
  }

  if (data.sections) {
    for (let i = 0; i < data.sections.length; i++) {
      const s = data.sections[i];
      if (!s.type) errors.push(`Section ${i}: type is required`);
      if (typeof s.order !== "number") errors.push(`Section ${i}: order must be a number`);
    }
  }

  if (data.design?.colors) {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    for (const [key, value] of Object.entries(data.design.colors)) {
      if (!hexRegex.test(value)) {
        errors.push(`Design color "${key}" must be a valid hex color`);
      }
    }
  }

  if (data.cmsData?.host?.contactEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.cmsData.host.contactEmail)) {
      errors.push("Host contact email is invalid");
    }
  }

  return { valid: errors.length === 0, errors };
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}
