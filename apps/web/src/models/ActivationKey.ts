/* eslint-disable simple-import-sort/imports */
/* eslint-disable ts/consistent-type-definitions */
/* eslint-disable unused-imports/no-unused-imports */
// eslint-disable-next-line ts/consistent-type-imports
import mongoose, { Schema, model, models, Model } from 'mongoose';

interface IActivationKey {
  key: string;
  macAddresses: string[];
  allowedDeviceCount: number;
}
console.log(mongoose.connection.readyState); // Reference mongoose explicitly

const ActivationKeySchema = new Schema<IActivationKey>({
  key: { type: String, required: true, unique: true },
  macAddresses: { type: [String], default: [] },
  allowedDeviceCount: { type: Number, required: true },
});

// Avoid duplicate model declaration during hot-reloading
export const ActivationKey: Model<IActivationKey> = models.ActivationKey || model<IActivationKey>('ActivationKey', ActivationKeySchema);
