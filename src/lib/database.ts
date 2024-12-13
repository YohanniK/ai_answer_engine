import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
// const options = {
//   tls: true,
//   tlsInsecure: true,
// };

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

// Use a global variable to persist the connection in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri || "YOUR_MONOGDB_URI")
      .then(mongoose =>
        mongoose.connection.useDb(
          process.env.MONGODB_DB_NAME || "YOUR_MONGODB_DB_NAME"
        )
      );
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
