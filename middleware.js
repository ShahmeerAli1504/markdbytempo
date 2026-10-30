// Removed: this site has no logins. Safe to delete this file.
import { NextResponse } from 'next/server';
export function middleware() {
  return NextResponse.next();
}
export const config = { matcher: ['/__removed__'] };
