import { Tables } from './supabase';

// 주문(order) 테이블 데이터 타입
export type DbOrder = Tables<'order'>;

// 사용자(users) 테이블 데이터 타입
export type DbUser = Tables<'users'>;

// 지갑(wallet) 테이블 데이터 타입
export type DbWallet = Tables<'wallet'>;
