import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
	return (
		<div>
			<Spinner variant="ellipsis" size={32} />
		</div>
	);
}
