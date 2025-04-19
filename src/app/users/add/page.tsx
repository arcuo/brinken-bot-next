"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { AddUserForm } from "../AddUserForm";
import { addUser } from "@/app/actions/users";

export default function AddDiscordUser() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const discordId = searchParams.get("discordId");
	const name = searchParams.get("name");
	const nickname = searchParams.get("nickname");

	const onSubmit: Parameters<typeof AddUserForm>[0]["onSubmit"] = async (
		values,
	) => {
		await addUser({
			...values,
		});
		// Redirect to the users page after successful submission
		router.push("/users");
	};

	return (
		<AddUserForm
			onSubmit={onSubmit}
			user={{
				discordId: discordId ?? undefined,
				name: name ?? undefined,
				nickname: nickname ?? undefined,
			}}
		/>
	);
}
