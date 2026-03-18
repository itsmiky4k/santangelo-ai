import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <style>{`
        html, body { 
          background: transparent !important; 
          margin: 0; 
          padding: 0;
          overflow: hidden;
        }
      `}</style>
      <ChatWidget />
    </>
  );
}