/**
 * Bootstraps an admin user so `/admin/login` has something to authenticate.
 *
 * Run with:  npm run admin:create
 *
 * Like the seed, this deliberately does NOT import `@/lib/db` or
 * `@/lib/admin-repositories`: both are marked `server-only` and throw when
 * evaluated outside the `react-server` condition. It builds its own client and
 * calls `hashPassword` directly, which carries no such marker.
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

import { hashPassword } from "@/lib/admin/password";
import { PrismaClient } from "@/lib/generated/prisma/client";

const MIN_PASSWORD_LENGTH = 12;
const MAX_USERNAME_LENGTH = 64;
const USERNAME_PATTERN = /^[a-z0-9._-]+$/i;

interface PendingRead {
  resolve: (line: string) => void;
  reject: (error: Error) => void;
}

/**
 * A single interface plus a line queue, because `question()` is unusable for
 * sequential prompts: on piped stdin readline drains every line at once and
 * emits them while only the first `question()` callback is registered, so the
 * rest are dropped and later prompts hit EOF. Queueing `line` events keeps them
 * regardless of when the consumer awaits, and rejects instead of exiting 0.
 */
function createPrompts() {
  const rl = createInterface({ input: stdin, output: stdout, terminal: stdin.isTTY === true });

  const buffered: string[] = [];
  const waiting: PendingRead[] = [];
  let closed = false;

  rl.on("line", (line: string) => {
    const next = waiting.shift();
    if (next !== undefined) next.resolve(line);
    else buffered.push(line);
  });

  rl.on("close", () => {
    closed = true;
    for (const pending of waiting.splice(0)) {
      pending.reject(new Error("stdin closed before all input was provided."));
    }
  });

  let muted = false;
  Object.defineProperty(rl, "_writeToOutput", {
    configurable: true,
    value: (text: string) => {
      if (!muted) stdout.write(text);
    },
  });

  function take(): Promise<string> {
    const ready = buffered.shift();
    if (ready !== undefined) return Promise.resolve(ready);
    if (closed) return Promise.reject(new Error("stdin closed before all input was provided."));
    return new Promise<string>((resolve, reject) => {
      waiting.push({ resolve, reject });
    });
  }

  return {
    async ask(label: string): Promise<string> {
      stdout.write(label);
      return (await take()).trim();
    },
    async askSecret(label: string): Promise<string> {
      stdout.write(label);
      muted = true;
      try {
        return await take();
      } finally {
        muted = false;
        stdout.write("\n");
      }
    },
    close(): void {
      rl.close();
    },
  };
}

function validateUsername(username: string): string | null {
  if (username.length < 3) return "Username must be at least 3 characters.";
  if (username.length > MAX_USERNAME_LENGTH) {
    return `Username must be at most ${MAX_USERNAME_LENGTH} characters.`;
  }
  if (!USERNAME_PATTERN.test(username)) {
    return "Username may only contain letters, numbers, dots, dashes, and underscores.";
  }
  return null;
}

async function main(): Promise<void> {
  const connectionString = process.env["DATABASE_URL"];
  if (connectionString === undefined || connectionString === "") {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env first.");
  }

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  const prompts = createPrompts();

  try {
    const username = await prompts.ask("Username: ");

    const usernameError = validateUsername(username);
    if (usernameError !== null) throw new Error(usernameError);

    const existing = await db.adminUser.findUnique({ where: { username } });
    if (existing !== null) {
      throw new Error(`User "${username}" already exists.`);
    }

    const password = await prompts.askSecret("Password: ");
    const confirmation = await prompts.askSecret("Confirm password: ");

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }
    if (password !== confirmation) {
      throw new Error("Passwords do not match.");
    }

    const { hash, salt } = await hashPassword(password);
    await db.adminUser.create({ data: { username, passwordHash: hash, passwordSalt: salt } });

    const total = await db.adminUser.count();
    console.log(`\nCreated admin user "${username}". Total admin users: ${total}.`);
  } finally {
    prompts.close();
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
