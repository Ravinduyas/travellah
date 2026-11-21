import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppLink,
  calculateTransferQuote,
  calculateTripTotal,
  generateBookingReference,
  pickVehicleForPassengers,
  validateBookingForm,
  validateEmail,
  validateTransferForm,
} from './travelLogic';

test('calculateTripTotal multiplies by guests and clamps the group size', () => {
  assert.deepEqual(calculateTripTotal(290, 2), { guests: 2, total: 580 });
  assert.deepEqual(calculateTripTotal(500, 0), { guests: 1, total: 500 });
  assert.deepEqual(calculateTripTotal(100, 99), { guests: 12, total: 1200 });
});

test('calculateTransferQuote scales by vehicle and doubles for return', () => {
  assert.deepEqual(calculateTransferQuote(80, 1, 'one-way'), {
    perLeg: 80,
    legs: 1,
    total: 80,
  });
  assert.deepEqual(calculateTransferQuote(80, 1.4, 'return'), {
    perLeg: 112,
    legs: 2,
    total: 224,
  });
});

test('pickVehicleForPassengers picks the smallest vehicle that fits', () => {
  const vehicles = [
    { id: 'van', seats: 8 },
    { id: 'car', seats: 3 },
    { id: 'coach', seats: 14 },
  ];
  assert.equal(pickVehicleForPassengers(vehicles, 2)?.id, 'car');
  assert.equal(pickVehicleForPassengers(vehicles, 4)?.id, 'van');
  assert.equal(pickVehicleForPassengers(vehicles, 14)?.id, 'coach');
  assert.equal(pickVehicleForPassengers(vehicles, 20), null);
});

test('validateEmail accepts valid emails and rejects malformed input', () => {
  assert.equal(validateEmail('traveler@example.com'), true);
  assert.equal(validateEmail('  alex.b@example.co.uk '), true);
  assert.equal(validateEmail('not-an-email'), false);
  assert.equal(validateEmail('user@domain'), false);
  assert.equal(validateEmail(''), false);
});

test('validateBookingForm catches missing fields and accepts complete bookings', () => {
  const invalid = validateBookingForm({
    fullName: '',
    email: 'bad-email',
    travelDate: '',
    guests: 0,
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.travelDate);
  assert.ok(invalid.errors.guests);

  const valid = validateBookingForm({
    fullName: 'Alex Buckmaster',
    email: 'alex@example.com',
    travelDate: '2026-12-15',
    guests: 2,
  });
  assert.equal(valid.valid, true);
});

test('validateTransferForm requires a flight number only for airport pick-ups', () => {
  const base = {
    fullName: 'Maya Lin',
    email: 'maya@example.com',
    townId: 'weligama',
    date: '2026-12-20',
    time: '09:30',
    flightNumber: '',
    passengers: 2,
  };
  const pickup = validateTransferForm({ ...base, direction: 'pickup' });
  assert.equal(pickup.valid, false);
  assert.ok(pickup.errors.flightNumber);

  const drop = validateTransferForm({ ...base, direction: 'drop' });
  assert.equal(drop.valid, true);

  const empty = validateTransferForm({
    ...base,
    townId: '',
    passengers: 0,
    direction: 'drop',
  });
  assert.ok(empty.errors.townId);
  assert.ok(empty.errors.passengers);
});

test('generateBookingReference creates deterministic formatted reference', () => {
  assert.equal(generateBookingReference('weligama', 12345), 'TRV-WEL-22345');
});

test('buildWhatsAppLink strips non-digits and encodes the message', () => {
  assert.equal(
    buildWhatsAppLink('+94 77-000 0000', 'Hi & hello'),
    'https://wa.me/94770000000?text=Hi%20%26%20hello',
  );
});
