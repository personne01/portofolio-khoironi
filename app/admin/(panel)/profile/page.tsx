"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import type { AdminContactInfo, AdminProfile } from "@/lib/admin/dto";
import { Card, ErrorBanner, Field, SuccessBanner, SubmitButton, TextInput } from "@/components/admin/fields";

type ProfileForm = Omit<AdminProfile, "id" | "careerStartDate"> & { careerStartDate: string };

type ContactForm = Omit<AdminContactInfo, "id">;

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileForm | null>(null);
  const [contact, setContact] = useState<ContactForm | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([adminApi.getProfile(), adminApi.getContactInfo()])
      .then(([profileRow, contactRow]) => {
        if (!active) return;
        setProfile({ ...profileRow, careerStartDate: profileRow.careerStartDate.slice(0, 10) });
        setContact({
          email: contactRow.email,
          phone: contactRow.phone,
          location: contactRow.location,
          availabilityText: contactRow.availabilityText,
        });
      })
      .catch((caught: unknown) => {
        if (active) setLoadError(caught instanceof ApiClientError ? caught.message : "Unable to load profile");
      });
    return () => {
      active = false;
    };
  }, []);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (profile === null) return;
    setSavingProfile(true);
    setProfileError(null);
    setSaved(null);
    try {
      await adminApi.updateProfile(profile);
      setSaved("Profile saved");
      router.refresh();
    } catch (caught) {
      setProfileError(caught instanceof ApiClientError ? caught.message : "Unable to save profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (contact === null) return;
    setSavingContact(true);
    setContactError(null);
    setSaved(null);
    try {
      await adminApi.updateContactInfo(contact);
      setSaved("Contact info saved");
      router.refresh();
    } catch (caught) {
      setContactError(caught instanceof ApiClientError ? caught.message : "Unable to save contact info");
    } finally {
      setSavingContact(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Shown in the hero and contact areas of the public site.</p>
      </div>

      <ErrorBanner message={loadError} />
      <SuccessBanner message={saved} />

      {profile === null || contact === null ? (
        <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>
      ) : (
        <>
          <Card title="Personal details" description="Name, headline, and availability shown on the landing section.">
            <form onSubmit={saveProfile} className="flex flex-col gap-4">
              <ErrorBanner message={profileError} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" htmlFor="profile-name">
                  <TextInput id="profile-name" value={profile.name} onChange={(name) => setProfile({ ...profile, name })} />
                </Field>
                <Field label="Full name" htmlFor="profile-full-name">
                  <TextInput
                    id="profile-full-name"
                    value={profile.fullName}
                    onChange={(fullName) => setProfile({ ...profile, fullName })}
                  />
                </Field>
                <Field label="Title" htmlFor="profile-title">
                  <TextInput id="profile-title" value={profile.title} onChange={(title) => setProfile({ ...profile, title })} />
                </Field>
                <Field label="Subtitle" htmlFor="profile-subtitle">
                  <TextInput
                    id="profile-subtitle"
                    value={profile.subtitle}
                    onChange={(subtitle) => setProfile({ ...profile, subtitle })}
                  />
                </Field>
                <Field label="Email" htmlFor="profile-email">
                  <TextInput
                    id="profile-email"
                    type="email"
                    value={profile.email}
                    onChange={(email) => setProfile({ ...profile, email })}
                  />
                </Field>
                <Field label="Location" htmlFor="profile-location">
                  <TextInput
                    id="profile-location"
                    value={profile.location}
                    onChange={(location) => setProfile({ ...profile, location })}
                  />
                </Field>
                <Field label="Resume URL" htmlFor="profile-resume" hint="Absolute https:// URL, a /path, or a #fragment.">
                  <TextInput
                    id="profile-resume"
                    value={profile.resumeUrl}
                    onChange={(resumeUrl) => setProfile({ ...profile, resumeUrl })}
                  />
                </Field>
                <Field label="Photo URL" htmlFor="profile-photo" hint="Absolute https:// URL or a /path.">
                  <TextInput
                    id="profile-photo"
                    value={profile.photoUrl}
                    onChange={(photoUrl) => setProfile({ ...profile, photoUrl })}
                  />
                </Field>
                <Field label="Availability status" htmlFor="profile-status">
                  <TextInput
                    id="profile-status"
                    value={profile.availabilityStatus}
                    onChange={(availabilityStatus) => setProfile({ ...profile, availabilityStatus })}
                  />
                </Field>
                <Field label="Availability text" htmlFor="profile-availability">
                  <TextInput
                    id="profile-availability"
                    value={profile.availabilityText}
                    onChange={(availabilityText) => setProfile({ ...profile, availabilityText })}
                  />
                </Field>
                <Field label="Career start date" htmlFor="profile-career-start">
                  <TextInput
                    id="profile-career-start"
                    type="date"
                    value={profile.careerStartDate}
                    onChange={(careerStartDate) => setProfile({ ...profile, careerStartDate })}
                  />
                </Field>
              </div>
              <div>
                <SubmitButton pending={savingProfile} pendingLabel="Saving profile…">
                  Save profile
                </SubmitButton>
              </div>
            </form>
          </Card>

          <Card title="Contact info" description="Used by the contact section and footer.">
            <form onSubmit={saveContact} className="flex flex-col gap-4">
              <ErrorBanner message={contactError} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email" htmlFor="contact-email">
                  <TextInput
                    id="contact-email"
                    type="email"
                    value={contact.email}
                    onChange={(email) => setContact({ ...contact, email })}
                  />
                </Field>
                <Field label="Phone" htmlFor="contact-phone">
                  <TextInput
                    id="contact-phone"
                    value={contact.phone}
                    onChange={(phone) => setContact({ ...contact, phone })}
                  />
                </Field>
                <Field label="Location" htmlFor="contact-location">
                  <TextInput
                    id="contact-location"
                    value={contact.location}
                    onChange={(location) => setContact({ ...contact, location })}
                  />
                </Field>
                <Field label="Availability text" htmlFor="contact-availability">
                  <TextInput
                    id="contact-availability"
                    value={contact.availabilityText}
                    onChange={(availabilityText) => setContact({ ...contact, availabilityText })}
                  />
                </Field>
              </div>
              <div>
                <SubmitButton pending={savingContact} pendingLabel="Saving contact info…">
                  Save contact info
                </SubmitButton>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
