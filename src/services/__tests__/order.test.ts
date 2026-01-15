import reducer, { createOrder, fetchOrderByNumber, clearOrder } from '../slices/order';
import type { TOrder } from '@utils-types';

describe('order slice reducer', () => {
  const initialState = {
    orderRequest: false,
    orderData: null,
    lastError: null
  };

  const mockOrder: TOrder = {
    _id: 'order-id',
    status: 'done',
    name: 'Test order',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    number: 123,
    ingredients: ['a', 'b']
  };

  it('should return initial state by default', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('should set orderRequest=true and clear error on createOrder.pending', () => {
    const nextState = reducer(
      { ...initialState, lastError: 'prev error' },
      createOrder.pending('', [])
    );

    expect(nextState.orderRequest).toBe(true);
    expect(nextState.lastError).toBeNull();
  });

  it('should set orderData and orderRequest=false on createOrder.fulfilled', () => {
    const loadingState = { ...initialState, orderRequest: true };

    const nextState = reducer(
      loadingState,
      createOrder.fulfilled(mockOrder, '', [])
    );

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.orderData).toEqual(mockOrder);
    expect(nextState.lastError).toBeNull();
  });

  it('should set lastError and orderRequest=false on createOrder.rejected', () => {
    const loadingState = { ...initialState, orderRequest: true };

    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Create error' }
    };

    const nextState = reducer(loadingState, action);

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.lastError).toBe('Create error');
  });

  it('should use default error message on createOrder.rejected without message', () => {
    const loadingState = { ...initialState, orderRequest: true };

    const action = {
      type: createOrder.rejected.type,
      error: {}
    };

    const nextState = reducer(loadingState, action);

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.lastError).toBe('Не удалось оформить заказ');
  });

  it('should clear lastError on fetchOrderByNumber.pending', () => {
    const prevState = { ...initialState, lastError: 'prev error' };

    const nextState = reducer(
      prevState,
      fetchOrderByNumber.pending('', 123)
    );

    expect(nextState.lastError).toBeNull();
  });

  it('should set orderData on fetchOrderByNumber.fulfilled', () => {
    const nextState = reducer(
      initialState,
      fetchOrderByNumber.fulfilled(mockOrder, '', 123)
    );

    expect(nextState.orderData).toEqual(mockOrder);
    expect(nextState.lastError).toBeNull();
  });

  it('should set lastError from payload when fetchOrderByNumber.rejected has string payload', () => {
    const action = {
      type: fetchOrderByNumber.rejected.type,
      payload: 'Не удалось получить заказ',
      error: { message: 'ignored' }
    };

    const nextState = reducer(initialState, action);

    expect(nextState.lastError).toBe('Не удалось получить заказ');
  });

  it('should set lastError from error.message when fetchOrderByNumber.rejected has message', () => {
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: { message: 'Network error' }
    };

    const nextState = reducer(initialState, action);

    expect(nextState.lastError).toBe('Network error');
  });

  it('should use default error on fetchOrderByNumber.rejected without payload and message', () => {
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: {}
    };

    const nextState = reducer(initialState, action);

    expect(nextState.lastError).toBe('Не удалось получить заказ');
  });

  it('should clear orderData and lastError on clearOrder', () => {
    const filledState = {
      orderRequest: false,
      orderData: mockOrder,
      lastError: 'some error'
    };

    const nextState = reducer(filledState, clearOrder());

    expect(nextState.orderData).toBeNull();
    expect(nextState.lastError).toBeNull();
  });
});
