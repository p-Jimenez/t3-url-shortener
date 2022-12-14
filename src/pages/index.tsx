import { signIn, signOut, useSession } from "next-auth/react";

import Head from "next/head";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useState } from "react";

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  
  const hello = trpc.useQuery(["url.hello", { text: "from tRPC" }]);
  const saveUrl = trpc.useMutation(["auth.saveUrl"]);

  const { data: session } = useSession();

  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");

  const postUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const shortUrl = await saveUrl.mutateAsync({ url, slug });

    setUrl("");
    setSlug("");
    
    console.table(shortUrl);
  }

  return (
    <>
      <Head>
        <title>URL Shortener</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center min-h-screen p-4">
        <nav className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">Link shortener</h1>
          {session?.user && (
            <span className="text-gray-600">
              Signed in as {session.user.email}
            </span>
          )}
          <button
            onClick={() => (session ? signOut() : signIn("github"))}
            className="text-gray-600"
          >
            {session ? "Sign out" : "Sign in"}
          </button>
        </nav>

        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Create <span className="text-purple-300">T3</span> App
        </h1>
        {/* url form */}
        <div className="flex flex-col items-center justify-center w-1/2 mt-5">
          <form className="flex flex-col items-center justify-center w-full" onSubmit={postUrl}>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:border-purple-500"
              type="text"
              name="url"
              placeholder="Enter a URL to shorten"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <input
                className="w-full p-2 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:border-purple-500"
                type="text"
                name="slug"
                placeholder="Enter a slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
            />
            <button
              className="w-full p-2 border border-gray-300 rounded-lg"
              type="submit"
            >
              Shorten
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
