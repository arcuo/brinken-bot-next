// import {
// 	createNewChannel,
// 	deleteChannels,
// 	getBotMember,
// 	getGuildRole,
// 	sendMessageToChannel,
// } from "@/lib/discord/client";
// import { OverwriteType } from "@discordjs/core/http-only";

// const everyone = await getGuildRole("@everyone");

// // await handleDayOfDinner(true);
// const channel = await createNewChannel({
// 	name: "test_channel",
// 	topic: "Testing channel",
// 	permission_overwrites: [
// 		...["211877936087695362"].map((x) => ({
// 			type: OverwriteType.Member,
// 			id: x,
// 			deny: Permissions.VIEW_CHANNEL.toString(),
// 		})),
// 		{
// 			type: OverwriteType.Member,
// 			id: (await getBotMember()).id,
// 			allow: (Permissions.VIEW_CHANNEL | Permissions.SEND_MESSAGES).toString(),
// 		},
// 		{
// 			type: OverwriteType.Role,
// 			id: everyone!.id,
// 			deny: (Permissions.VIEW_CHANNEL | Permissions.SEND_MESSAGES).toString(),
// 		},
// 	],
// });
// console.log(channel);

// await deleteChannels(channel.id);

process.exit(0);
