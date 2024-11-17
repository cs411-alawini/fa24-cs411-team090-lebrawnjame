'use client'
// pages/LiveStreamPage.tsx
import { useEffect, useState } from "react";

const LiveStreamPage = () => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (isLive) {
      const chatangoScript = document.createElement("script");
      chatangoScript.id = "cid0020000392664811261";
      chatangoScript.src = "//st.chatango.com/js/gz/emb.js";
      chatangoScript.async = true;
      chatangoScript.dataset.cfasync = "false";
      chatangoScript.style.width = "100%";
      chatangoScript.style.height = "100%";
      chatangoScript.innerHTML = JSON.stringify({
        handle: "westreaming",
        arch: "js",
        styles: {
          a: "CC0000",
          b: 100,
          c: "FFFFFF",
          d: "FFFFFF",
          k: "CC0000",
          l: "CC0000",
          m: "CC0000",
          n: "FFFFFF",
          p: 10,
          q: "CC0000",
          r: 100,
          fwtickm: 1,
        },
      });
      document.getElementById("chat-container")?.appendChild(chatangoScript);

      return () => {
        document.getElementById("chat-container")?.removeChild(chatangoScript);
      };
    }
  }, [isLive]);

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Live Stream Dashboard</h1>
        <button style={styles.goLiveButton} onClick={() => setIsLive(!isLive)}>
          {isLive ? "End Stream" : "Go Live"}
        </button>
      </header>

      <div style={styles.contentContainer}>
        <div style={styles.streamContainer}>
          {isLive ? (
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/UBol6eDEr2k?autoplay=1"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube Live Stream"
            ></iframe>
          ) : (
            <div style={styles.placeholder}>
              <p style={styles.placeholderText}>Click "Go Live" to start streaming</p>
            </div>
          )}
        </div>

        <div style={styles.chatContainer}>
          <h2 style={styles.chatTitle}>Live Chat</h2>
          <div id="chat-container" style={styles.chatBox}></div>
        </div>
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  pageContainer: {
    fontFamily: "Arial, sans-serif",
    color: "#333",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "2px solid #ddd",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  goLiveButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "row" as "row",
    width: "100%",
    maxWidth: "1400px",
    gap: "20px",
  },
  streamContainer: {
    flex: 3,
    backgroundColor: "#000",
    borderRadius: "10px",
    overflow: "hidden",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    color: "#fff",
  },
  placeholderText: {
    fontSize: "18px",
    textAlign: "center" as "center",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    padding: "10px",
  },
  chatTitle: {
    fontSize: "20px",
    margin: "0 0 10px",
    color: "#333",
  },
  chatBox: {
    width: "100%",
    height: "500px",
  },
};

export default LiveStreamPage;
