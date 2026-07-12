const Skeleton = () => {
	return (
		<div className="animate-pulse space-y-4">
			<div className="mb-10 h-[200] w-[200] rounded-full bg-gray-300"></div>
			<div className="h-6 w-3/4 rounded bg-gray-300"></div>
			<div className="h-6 w-1/2 rounded bg-gray-300"></div>
			<div className="h-6 w-full rounded bg-gray-300"></div>
		</div>
	);
};

export default Skeleton;
