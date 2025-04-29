import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
	return (
		<div className="flex items-start justify-center">
			<Spinner variant="ellipsis" size={32} />
		</div>
	);
}
