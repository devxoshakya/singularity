/* eslint-disable simple-import-sort/imports */
import { NextResponse } from 'next/server';
import { dbConnect } from '@/libs/dbConnect';
import { ActivationKey } from '@/models/ActivationKey';

export async function POST(request: Request) {
  await dbConnect();

  const { key, allowedDeviceCount } = await request.json();

  if (!key || typeof allowedDeviceCount !== 'number') {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  try {
    const newKey = new ActivationKey({ key, allowedDeviceCount });
    await newKey.save();
    return NextResponse.json({ message: 'Activation key added successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding activation key', error }, { status: 500 });
  }
}
