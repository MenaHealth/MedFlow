"use client"

import { useSession } from "next-auth/react";

export function EditCard() {

    let session = useSession().data;
    
    async function updateProfile({ updateAccountType, specialties }) {
        try {
          if (!session) {
            alert("You must be signed in to update your profile");
            return;
          }
          if (updateAccountType === "Triage" || updateAccountType === "Evac") {
            specialties = [];
          }
          const response = await fetch(`/api/user/${session?.user?.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              accountType: updateAccountType,
              specialties: specialties,
            }),
          });
    
          // if the response is ok, update the session
          if (response.ok && session?.user) {
            session.user.accountType = updateAccountType;
            session.user.specialties = specialties;
            // redirect to home
            window.location.href = "/";
          }
        } catch (error) {
          console.log(error);
        }
      }
    return (
        <div className="prompt_card space-y-2">
            Hello {session?.user?.name}!
            <div>Account Type: {session?.user?.accountType}</div>
            <div>Specialties: {session?.user?.specialties.join(", ")}</div>

            <button
                onClick={() => {
                    updateProfile({ updateAccountType: 'Unspecified', specialties: [] });
                }}
                className='black_btn'
            >Edit Profile</button>
        </div>
    )
}