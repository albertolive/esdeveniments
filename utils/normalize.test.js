const { normalizeEvent, normalizeEvents } = require('./normalize');

describe('normalizeEvent', () => {
  it('should normalize a single event object', () => {
    const event = {
      id: '1',
      start: { dateTime: '2023-05-01T14:00:00Z' },
      end: { dateTime: '2023-05-01T15:00:00Z' },
      name: 'Test Event',
      description: 'This is a test event',
      price: '10.99',
      image: 'http://example.com/image.jpg',
      location: 'Test Location',
      category: 'Test Category',
    };

    const normalizedEvent = normalizeEvent(event);

    expect(normalizedEvent).toEqual({
      id: 1,
      start: '2023-05-01T14:00:00Z',
      end: '2023-05-01T15:00:00Z',
      name: 'Test Event',
      description: 'This is a test event',
      price: 10.99,
      image: 'http://example.com/image.jpg',
      location: 'Test Location',
      category: 'Test Category',
    });
  });

  it('should handle missing or invalid fields', () => {
    const event = {
      id: 'invalid',
      name: '',
      price: 'not a number',
      start: { date: '2023-05-01' },
      end: { date: '2023-05-02' },
    };

    const normalizedEvent = normalizeEvent(event);

    expect(normalizedEvent).toEqual({
      id: null,
      start: '2023-05-01',
      end: '2023-05-02',
      name: '',
      description: '',
      price: 0,
      image: '',
      location: '',
      category: '',
    });
  });
});

describe('normalizeEvents', () => {
  it('should normalize an array of events', () => {
    const events = [
      {
        id: '1',
        name: 'Event 1',
        price: '10.99',
        start: { dateTime: '2023-05-01T10:00:00Z' },
        end: { dateTime: '2023-05-01T12:00:00Z' },
      },
      {
        id: '2',
        name: 'Event 2',
        price: '20.50',
        start: { date: '2023-05-02' },
        end: { date: '2023-05-03' },
      },
    ];

    const normalizedEvents = normalizeEvents(events);

    expect(normalizedEvents).toEqual([
      {
        id: 1,
        start: '2023-05-01T10:00:00Z',
        end: '2023-05-01T12:00:00Z',
        name: 'Event 1',
        description: '',
        price: 10.99,
        image: '',
        location: '',
        category: '',
      },
      {
        id: 2,
        start: '2023-05-02',
        end: '2023-05-03',
        name: 'Event 2',
        description: '',
        price: 20.50,
        image: '',
        location: '',
        category: '',
      },
    ]);
  });

  it('should handle an empty array', () => {
    const events = [];
    const normalizedEvents = normalizeEvents(events);
    expect(normalizedEvents).toEqual([]);
  });
});
