import { toResponse } from "@/lib/api";
import { getContactInfo } from "@/lib/repositories";

/** GET /api/v1/contact-info — singleton contact block. */
export async function GET(): Promise<Response> {
  return toResponse(() => getContactInfo());
}
