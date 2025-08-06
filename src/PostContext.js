// Put here everything that is related to the component
// Also add all the state and its updating logic, minus the useEffect

import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

/* 1 - Create a Context */
const PostContext = createContext();

// returns a  provider
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );

  const [searchQuery, setSearchQuery] = useState("");

  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }
  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}>
      {children}
    </PostContext.Provider>
  );
}

// setting the custom hook
function usePost() {
  const context = useContext(PostContext);
  //to prevent someome to access the Context value where they shoulkdn't:
  if (context === undefined)
    throw new Error("PostContext was used outside the PostProvider.");
  return context;
}

//named export
//export { PostContext, PostProvider };

//now, instead of export and expose the context object itself, we just expose a
//function wicht with we can then access that.
// Agora ao invés de usar const nomeDaProp = useContext(PostContext) em
// vários componentes, usamos apenas const nomeDaProp = usePort()
export { PostProvider, usePost };

/** usePosts is our custom hook to read the value out of the PostContext */
