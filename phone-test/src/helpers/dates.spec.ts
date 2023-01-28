import { formatDate } from './dates';

describe('dates helpers', () => {
  it('should format date', () => {
    const date = new Date('01/01/2019');
    const formattedDate = formatDate(date.toString());

    expect(formattedDate).toBe('Jan 1 - 00:00');
  });
});
