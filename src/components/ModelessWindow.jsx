import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ModelessWindow({ children, zIndex, onFocus, onClose, saveSettings, getSettings  }) {
  const currentSettings = getSettings();
  const [pos, setPos] = useState({ x: currentSettings.eventLogPositions?.x || 100, y: currentSettings.eventLogPositions?.y || 100 });
  const [size, setSize] = useState({ w: currentSettings.eventLogPositions?.w || 300, h: currentSettings.eventLogPositions?.h || 400 }); 
  
  const windowRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizing = useRef(false);

  // DRAGGING
  function startDrag(e) {
    onFocus();
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
    window.addEventListener("pointermove", drag);
    window.addEventListener("pointerup", stopDrag);
  }

  function drag(e) {
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    });
  }

  function stopDrag() {
    window.removeEventListener("pointermove", drag);
    window.removeEventListener("pointerup", stopDrag);
    const currentSettings = getSettings();
    currentSettings.eventLogPositions = {x: pos.x, y: pos.y, w: size.w, h: size.h};
    saveSettings(currentSettings);
  }

  // RESIZING
  function startResize(e) {
    onFocus();
    resizing.current = { startX: e.clientX, startY: e.clientY, startW: size.w, startH: size.h };
    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stopResize);
  }

  function resize(e) {
    const dx = e.clientX - resizing.current.startX;
    const dy = e.clientY - resizing.current.startY;
    setSize({
      w: Math.max(150, resizing.current.startW + dx),
      h: Math.max(100, resizing.current.startH + dy)
    });
  }

  function stopResize() {
    window.removeEventListener("pointermove", resize);
    window.removeEventListener("pointerup", stopResize);
    const currentSettings = getSettings();
    currentSettings.eventLogPositions = {x: pos.x, y: pos.y, w: size.w, h: size.h};
    saveSettings(currentSettings);
  }

  return createPortal(
    <div 
      ref={windowRef}
      onPointerDown={onFocus}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        background: "darkslategray",
        opacity: 0.9,
        color: "white",
        zIndex: 1,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "0.4em",
        border: "1px solid gray"
      }}
    >
      {/* TITLE BAR */}
      <div
        style={{
          padding: "4px 8px",
          cursor: "grab",
          userSelect: "none",
          display: "flex",
          justifyContent: "space-between",
           borderBottom: "1px solid gray"
        }}
        onPointerDown={startDrag}
      >
        <span style={{
          background: "transparent",
          color: "white"}}>Events</span>
        <button onClick={onClose} style={{padding: 0, background: "transparent",
          opacity: 1,
          color: "white"}}>✕</button>
      </div>

      {/* CONTENT */}
      <div id="event-log" style={{ flex: 1, overflow: "auto", padding: 8 }}>
        {children}
      </div>

      {/* RESIZE HANDLE */}
      <div
        onPointerDown={startResize}
        style={{
          width: 16,
          height: 16,
          background: "transparent",
          position: "absolute",
          right: 0,
          bottom: 0,
          cursor: "nwse-resize"
        }}
      />
    </div>,
    document.body
  );
}
