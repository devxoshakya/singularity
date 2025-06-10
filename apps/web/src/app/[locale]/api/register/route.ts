/* eslint-disable simple-import-sort/imports */
import { NextResponse } from 'next/server';
import { dbConnect } from '@/libs/dbConnect';
import { ActivationKey } from '@/models/ActivationKey';

export async function POST(request: Request) {
  await dbConnect();

  const headers = request.headers;
  const key = headers.get('key');
  const macAddress = headers.get('macaddress');

  if (!key || !macAddress) {
    return NextResponse.json({ message: 'Missing key or macAddress in headers' }, { status: 400 });
  }

  try {
    const activationKey = await ActivationKey.findOne({ key }); // Correct usage of findOne
    if (!activationKey) {
      return NextResponse.json({ message: 'Invalid activation key' }, { status: 403 });
    }

    if (activationKey.macAddresses.includes(macAddress)) {
      return NextResponse.json({ message: 'MAC address already registered' }, { status: 403 });
    }

    if (activationKey.allowedDeviceCount <= 0) {
      return NextResponse.json({ message: 'Device limit reached' }, { status: 403 });
    }

    activationKey.macAddresses.push(macAddress);
    activationKey.allowedDeviceCount -= 1;
    await activationKey.save();

    return NextResponse.json({ message: 'Device registered successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error during registration', error }, { status: 500 });
  }
}
