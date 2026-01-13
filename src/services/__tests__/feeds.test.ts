import reducer from '../slices/feeds';
import { fetchFeed, fetchProfileOrders, initialState } from '../slices/feeds';

import type { TOrder, TOrdersData } from '@utils-types';

describe('feeds slice reducer', () => {
  it('should set isLoading=true and clear error on fetchFeed.pending', () => {
    const nextState = reducer(
      initialState,
      fetchFeed.pending('', undefined)
    );

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should save feed and set isLoading=false on fetchFeed.fulfilled', () => {
    const feed: TOrdersData = {
      orders: [],
      total: 10,
      totalToday: 3
    };

    const loadingState = { ...initialState, isLoading: true };

    const nextState = reducer(
      loadingState,
      fetchFeed.fulfilled(feed, '', undefined)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.feed).toEqual(feed);
    expect(nextState.error).toBeNull();
  });

  it('should save error and set isLoading=false on fetchFeed.rejected', () => {
    const loadingState = { ...initialState, isLoading: true };

    const action = {
      type: fetchFeed.rejected.type,
      error: { message: 'Feed error' }
    };

    const nextState = reducer(loadingState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Feed error');
  });

  it('should set isLoading=true and clear error on fetchProfileOrders.pending', () => {
    const nextState = reducer(
      initialState,
      fetchProfileOrders.pending('', undefined)
    );

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should save orders and set isLoading=false on fetchProfileOrders.fulfilled', () => {
    const orders: TOrder[] = [
      {
        _id: '1',
        status: 'done',
        name: 'Order 1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        number: 1,
        ingredients: ['a', 'b']
      }
    ];

    const loadingState = { ...initialState, isLoading: true };

    const nextState = reducer(
      loadingState,
      fetchProfileOrders.fulfilled(orders, '', undefined)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.orders).toEqual(orders);
    expect(nextState.error).toBeNull();
  });

  it('should save error and set isLoading=false on fetchProfileOrders.rejected', () => {
    const loadingState = { ...initialState, isLoading: true };

    const action = {
      type: fetchProfileOrders.rejected.type,
      error: { message: 'Orders error' }
    };

    const nextState = reducer(loadingState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Orders error');
  });
});
