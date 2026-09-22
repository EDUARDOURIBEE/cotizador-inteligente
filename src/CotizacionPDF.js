import React, { forwardRef } from "react";

const wholeMoney = (value) => `$${Math.round(Number(value) || 0).toLocaleString("es-MX")}`;

const CotizacionPDF = forwardRef(function CotizacionPDF({ client, cart, subtotal, iva, total, dimensions }, ref) {
  const today = new Date().toLocaleDateString("es-MX").split("/");

  return (
    <section className="print-note cotizacion" ref={ref} aria-label="Cotización en formato de nota">
      <header className="pdf-header encabezado"><img src="/logo.jpeg" alt="Logotipo oficial" /><div><h1>Aceros y Lámina Americana</h1><p>Su satisfacción es nuestro negocio</p></div><div className="pdf-contact"><span>Teléfono</span><strong>618 218 7056</strong></div></header>
      <div className="pdf-meta"><div><strong>CLIENTE:</strong><span>{client.name || "No indicado"}</span></div><div><strong>DOMICILIO:</strong><span>{client.address || "No indicado"}</span></div><div><strong>TELÉFONO:</strong><span>{client.phone || "No indicado"}</span></div><div><strong>MEDIDAS:</strong><span>{client.width || "-"} m x {client.length || "-"} m ({dimensions.sheets || 0} láminas)</span></div><div><strong>FOLIO:</strong><span>{String(Date.now()).slice(-3)}</span></div><div><strong>FECHA:</strong><span>{today.join("/")}</span></div></div>
      <table className="tabla-materiales"><thead><tr><th>Material</th><th>Medida / Calibre</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead><tbody>{cart.length ? cart.slice(0, 12).map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.displayUnit || item.unit}</td><td>{item.quantity}</td><td>{wholeMoney(item.price)}</td><td>{wholeMoney(item.price * item.quantity)}</td></tr>) : <tr><td colSpan="5">No hay materiales seleccionados</td></tr>}{cart.length > 12 && <tr><td colSpan="5">+ {cart.length - 12} materiales más</td></tr>}</tbody></table>
      <section className="pdf-observations"><strong>OBSERVACIONES</strong><p>{client.observations || "Sin observaciones"}</p></section><section className="pdf-totals total"><div><span>Subtotal</span><strong>{wholeMoney(subtotal)}</strong></div><div><span>IVA (16%)</span><strong>{wholeMoney(iva)}</strong></div><div className="pdf-grand-total"><span>Total</span><strong>{wholeMoney(total)}</strong></div></section><footer className="pdf-footer">Gracias por su preferencia</footer>
    </section>
  );
});

export default CotizacionPDF;
