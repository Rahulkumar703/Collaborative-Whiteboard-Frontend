import CreateOrJoinRoom from "@/components/create-or-join-room";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 p-4 text-center">
      <h1 className="font-bold sm:text-6xl text-5xl max-w-4xl">
        Welcome to the Collaborative Whiteboard App
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground">
        Create or join a room to start collaborating on your next masterpiece!
      </p>

      <Image
        src="/logo.svg"
        alt="Collaborative Whiteboard"
        className="w-52 h-52 mb-4"
        width={208}
        height={208}
        priority
      />

      <CreateOrJoinRoom />
    </div>
  );
}
