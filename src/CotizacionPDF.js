import React, { forwardRef } from "react";

const wholeMoney = (value) => `$${Math.round(Number(value) || 0).toLocaleString("es-MX")}`;

const CotizacionPDF = forwardRef(function CotizacionPDF({ client, cart, total, dimensions }, ref) {
  const today = new Date().toLocaleDateString("es-MX").split("/");

  return (
    <section className="print-note cotizacion" ref={ref} aria-label="Cotización en formato de nota">
      <img src="/nota-generada.svg" alt="Nota de cotización de Aceros y Lámina Americana" />
      <img className="note-logo" src="/logo.jpeg" alt="Logotipo oficial" />
      <div className="note-folio campo">{String(Date.now()).slice(-3)}</div>
      <div className="note-date campo"><span>{today[0]}</span><span>{today[1]}</span><span>{today[2]}</span></div>
      <div className="note-client note-name campo">{client.name}</div>
      <div className="note-client note-address campo">{client.address || "No indicada"}</div>
      <div className="note-client note-phone campo">{client.phone}</div>
      <div className="note-measures campo">{client.width} m x {client.length} m | {dimensions.sheets} láminas</div>
      <div className="note-items campo">
        {cart.slice(0, 7).map((item) => (
          <div className="note-item" key={item.id}>
            <span>{item.quantity}</span>
            <span>{item.name}{item.displayUnit ? ` - ${item.displayUnit}` : ""}</span>
            <span>{wholeMoney(item.price)}</span>
            <span>{wholeMoney(item.price * item.quantity)}</span>
          </div>
        ))}
        {cart.length > 7 && <div className="note-item"><span /><span>+ {cart.length - 7} materiales más</span><span /><span /></div>}
      </div>
      <div className="note-observations campo">{client.observations}</div>
      <div className="note-total campo">{wholeMoney(total)}</div>
    </section>
  );
});

export default CotizacionPDF;
