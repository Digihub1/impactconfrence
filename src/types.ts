/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AttendeeDetails {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  stateCity: string;
}

export interface AttendanceDetails {
  type: 'In-person' | 'Online';
  days: string[]; // ['24', '25', '26', '27']
  requestVisaLetter: boolean;
}

export interface MinistryDetails {
  organization: string;
  roleTitle: string;
  wantsToVolunteer: boolean;
  volunteerRoles: string[];
}

export interface PaymentDetails {
  ticketType: 'Free' | 'Standard' | 'VIP';
  promoCode?: string;
  discountApplied?: number;
  totalPaid: number;
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  termsAccepted: boolean;
}

export interface Registration {
  id: string;
  date: string;
  ticketNumber: string;
  qrCodeUrl: string;
  attendee: AttendeeDetails;
  attendance: AttendanceDetails;
  ministry: MinistryDetails;
  payment: PaymentDetails;
  status: 'Confirmed' | 'Pending';
}

export interface Nomination {
  id: string;
  date: string;
  nominatorName: string;
  nominatorContact: string;
  nomineeName: string;
  nomineeOrganization: string;
  state: string;
  reason: string;
  supportingLink?: string;
  fileName?: string; // Mock attachment filename
}

export interface VolunteerSignup {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  message?: string;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}
