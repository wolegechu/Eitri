import * as EventSystem from '../../src/event_system';

describe('event system', () => {
  const observer = jest.fn((e: EventSystem.FssEvent) => {});

  test('AddEventListener', () => {
    EventSystem.AddEventListener(EventSystem.EventType.KEY_PRESS_ANY, observer);
    const event = new KeyboardEvent('keydown');
    document.dispatchEvent(event);

    expect(observer).toBeCalled();
    observer.mockClear();
  });

  test('RemoveEventListener', () => {
    EventSystem.AddEventListener(EventSystem.EventType.KEY_PRESS_ANY, observer);
    EventSystem.RemoveEventListener(
        EventSystem.EventType.KEY_PRESS_ANY, observer);
    const event = new KeyboardEvent('keydown');
    document.dispatchEvent(event);

    expect(observer.mock.calls.length).toBe(0);
  });
});