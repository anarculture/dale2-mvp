import { calculateAge } from '../src/utils/helpers';

describe('calculateAge', () => {
  it('returns correct age for a known birth date', () => {
    const birthDate = new Date('1990-06-15');
    const currentDate = new Date('2024-06-14');
    jest.useFakeTimers().setSystemTime(currentDate);

    expect(calculateAge(birthDate)).toBe(33);

    jest.useRealTimers();
  });
});
