import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#F7F2EB",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Jost', sans-serif"
    }}>
      <div style={{ textAlign: "center", color: "#2C1810", opacity: 0.5 }}>
        <p style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase" }}>
          Grotta di Sant'Angelo in Criptis
        </p>
        <p style={{ fontSize: "11px", marginTop: "8px" }}>
          Widget demo — clicca il pulsante in basso a destra
        </p>
      </div>
      <ChatWidget />
    </main>
  );
}
