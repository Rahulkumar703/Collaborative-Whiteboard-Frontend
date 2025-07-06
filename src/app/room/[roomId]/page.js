import WhiteboardWrapper from "@/components/whiteboard-wrapper";
import { redirect } from "next/dist/server/api-utils";

export async function generateMetadata({ params }) {
  const { roomId } = await params;
  return {
    title: `Collaborative Whiteboard - ${roomId}`,
    description: `Join room ${roomId} to collaborate on a whiteboard.`,
  };
}

export default async function WhiteboardPage({ params }) {
  const { roomId } = await params;
  if (!roomId) {
    redirect("/room");
  }
  return <WhiteboardWrapper roomId={roomId} />;
}
