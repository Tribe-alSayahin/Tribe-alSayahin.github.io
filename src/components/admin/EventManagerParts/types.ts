import type { AdminEventStatus } from '../../../lib/events';

export interface EventFormState {
  title: string;
  slug: string;
  summary: string;
  description: string;
  event_date_gregorian: string;
  event_date_hijri: string;
  location: string;
  status: AdminEventStatus;
}
