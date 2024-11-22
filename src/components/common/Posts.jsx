import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

//this file defines the structure of the section which will show all the posts.

const Posts = ({feedType}) => {
    
	const getPostendPoint = ()=>{
		switch(feedType){
			case "forYou":
				return "/api/posts/all";
			case "following":
			    return "/api/posts/following";
			default:
				return "/api/posts/all";

		}
	};

	const POST_ENDPOINT =getPostendPoint();

	const {data:posts, isLoading, refetch, isRefetching}= useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if(!res.ok){
					throw new Error(data.error || "Something went wrong");
				}

				return data;

			} catch (error) {
				throw new Error(error);
			}
		},
	})


	useEffect(()=>{
		refetch();
	}, [feedType, refetch]);


       //1):IF REFETECHING OR LOADING THEN SHOW THIS skeleton
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;