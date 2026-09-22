import React, { createContext, useContext, useMemo, useState } from "react";
import "./App.css";

const WHATSAPP_NUMBER = "5216182187056";
const materials = [
  { id: "color-26", name: "LÁMINA COLOR 26", price: 68, unit: "/ft" },
  { id: "color-28", name: "LÁMINA COLOR 28", price: 61, unit: "/ft" },
  { id: "galv-26", name: "LÁMINA GALVANIZADA 26", price: 62, unit: "/ft" },
  { id: "galv-28", name: "LÁMINA GALVANIZADA 28", price: 53, unit: "/ft" },
  { id: "trans-10", name: "LÁMINA TRANSPARENTE 10 Ft", price: 2100, unit: "pieza" },
  { id: "trans-20", name: "LÁMINA TRANSPARENTE 20 Ft", price: 3800, unit: "pieza" },
  { id: "canal-color", name: "CANAL COLOR", price: 55, unit: "/ft" },
  { id: "canal-galv", name: "CANAL GALVANIZADO", price: 50, unit: "/ft" },
  { id: "caballete-color", name: "CABALLETE COLOR", price: 55, unit: "/ft" },
  { id: "caballete-galv", name: "CABALLETE GALVANIZADO", price: 50, unit: "/ft" },
  { id: "w-color", name: "W COLOR", price: 61, unit: "/ft" },
  { id: "w-galv", name: "W GALVANIZADO", price: 53, unit: "/ft" },
  { id: "desague-10", name: "TUBO DE DESAGÜE COLOR 10 Ft", price: 525, unit: "pieza" },
  { id: "desague-8", name: "TUBO DE DESAGÜE COLOR 8 Ft", price: 442, unit: "pieza" },
  { id: "codos", name: "CODOS COLOR", price: 80, unit: "pieza" },
  { id: "canal-j", name: "CANAL J GALVANIZADO 1 Ft", price: 20, unit: "pieza" },
  { id: "pijas", name: "PIJAS VARIAS", price: 4, unit: "pieza" },
  { id: "caballete-trans", name: "CABALLETE TRANSPARENTE 12 Ft", price: 1690, unit: "pieza" },
  { id: "ptr-1x1-c14", name: "PTR 1x1 C.14", price: 322, unit: "pieza" },
  { id: "ptr-1-5x1-5-c14", name: "PTR 1 1/2 x 1 1/2 C.14", price: 489, unit: "pieza" },
  { id: "ptr-1-5x1-5-c18", name: "PTR 1 1/2 x 1 1/2 C.18", price: 412, unit: "pieza" },
  { id: "ptr-2-5x2-5-c12", name: "PTR 2 1/2 x 2 1/2 C.12", price: 1140, unit: "pieza" },
  { id: "ptr-2x1-c14", name: "PTR 2 x 1 C.14", price: 497, unit: "pieza" },
  { id: "ptr-2x2-c14", name: "PTR 2 x 2 C.14", price: 660, unit: "pieza" },
  { id: "ptr-2x2-galv-c18", name: "PTR 2 x 2 GALVANIZADO C.18", price: 540, unit: "pieza" },
  { id: "ptr-3x1-5-c14", name: "PTR 3 x 1 1/2 C.14", price: 742, unit: "pieza" },
  { id: "ptr-3x3-c14", name: "PTR 3 x 3 C.14", price: 945, unit: "pieza" },
  { id: "ptr-4x1-5-c14", name: "PTR 4 x 1 1/2 C.14", price: 915, unit: "pieza" },
  { id: "ptr-4x2-c14", name: "PTR 4 x 2 C.14", price: 990, unit: "pieza" },
  { id: "ptr-4x4-c14", name: "PTR 4 x 4 C.14", price: 1150, unit: "pieza" },
  { id: "ptr-4x4x1-4-c14-polin", name: "PTR 4 x 4 x 1/4 C.14 POLÍN", price: 2532, unit: "pieza" },
  { id: "polin-3x1-5-c14", name: "POLÍN 3 x 1 1/2 C.14", price: 548, unit: "pieza" },
  { id: "polin-4x2-c14", name: "POLÍN 4 x 2 C.14", price: 750, unit: "pieza" },
  { id: "polin-4x2-c16", name: "POLÍN 4 x 2 C.16", price: 650, unit: "pieza" },
  { id: "polin-6x2-c14", name: "POLÍN 6 x 2 C.14", price: 820, unit: "pieza" },
  { id: "polin-6x2-c15", name: "POLÍN 6 x 2 C.15", price: 782, unit: "pieza" },
  { id: "polin-6x2-c16", name: "POLÍN 6 x 2 C.16", price: 715, unit: "pieza" },
];

const CotizacionContext = createContext(null);
const money = (value) => `$${Number(value || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
const wholeMoney = (value) => `$${Math.round(Number(value) || 0).toLocaleString("es-MX")}`;

function CotizacionProvider({ children }) {
  const [client, setClient] = useState({ name: "", phone: "", address: "", width: "", length: "", observations: "" });
  const [cart, setCart] = useState([]);
  const updateClient = (field, value) => setClient((current) => ({ ...current, [field]: value }));
  const addMaterial = (material, quantity) => {
    const amount = Math.max(1, Number(quantity) || 1);
    setCart((current) => {
      const existing = current.find((item) => item.id === material.id);
      if (existing) return current.map((item) => item.id === material.id ? { ...item, quantity: item.quantity + amount } : item);
      return [...current, { ...material, quantity: amount }];
    });
  };
  const removeMaterial = (id) => setCart((current) => current.filter((item) => item.id !== id));
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;
  const dimensions = useMemo(() => {
    const width = Number(client.width) || 0;
    const length = Number(client.length) || 0;
    const rows = Math.ceil((width * 100) / 92);
    const columns = Math.ceil(length / 8);
    return { rows, columns, sheets: width && length ? rows * columns : 0 };
  }, [client.width, client.length]);
  return <CotizacionContext.Provider value={{ client, updateClient, cart, addMaterial, removeMaterial, subtotal, total, dimensions }}>{children}</CotizacionContext.Provider>;
}

function FormularioCliente() {
  const { client, updateClient } = useContext(CotizacionContext);
  return <section className="panel client-panel"><div className="section-heading"><span className="step">01</span><div><p className="eyebrow">Datos del cliente</p><h2>¿Para quién cotizamos?</h2></div></div><div className="form-grid">
    <label>Nombre completo<input required value={client.name} onChange={(e) => updateClient("name", e.target.value)} placeholder="Ej. Juan Pérez" /></label>
    <label>Teléfono<input required type="tel" value={client.phone} onChange={(e) => updateClient("phone", e.target.value)} placeholder="10 dígitos" /></label>
    <label className="wide">Dirección <span>(opcional)</span><input value={client.address} onChange={(e) => updateClient("address", e.target.value)} placeholder="Calle, número y colonia" /></label>
    <label>Ancho (m)<input required type="number" min="0.01" step="0.01" value={client.width} onChange={(e) => updateClient("width", e.target.value)} placeholder="0.00" /></label>
    <label>Largo (m)<input required type="number" min="0.01" max="8" step="0.01" value={client.length} onChange={(e) => updateClient("length", e.target.value)} placeholder="Máximo 8 m" /></label>
    <label className="wide">Observaciones <span>(opcional)</span><textarea value={client.observations} onChange={(e) => updateClient("observations", e.target.value)} placeholder="Color, calibre u otro detalle"></textarea></label>
  </div></section>;
}

function SelectorMateriales() {
  const { addMaterial } = useContext(CotizacionContext);
  const [selected, setSelected] = useState(materials[0].id);
  const [quantity, setQuantity] = useState(1);
  const [length, setLength] = useState(1);
  const [lengthUnit, setLengthUnit] = useState("m");
  const material = materials.find((item) => item.id === selected);
  const isPerFoot = material.unit === "/ft";
  const feet = isPerFoot ? (lengthUnit === "m" ? Number(length) * 3.28084 : Number(length)) : 0;
  const pricePerPiece = isPerFoot ? material.price * feet : material.price;
  const addToCart = () => addMaterial({ ...material, id: isPerFoot ? `${material.id}-${lengthUnit}-${Number(length)}` : material.id, price: pricePerPiece, displayUnit: isPerFoot ? `${Number(length).toFixed(2)} ${lengthUnit === "m" ? "m" : "ft"} (${feet.toFixed(2)} ft)` : material.unit, basePrice: material.price, length: Number(length), lengthUnit, feet }, quantity);
  return <section className="panel"><div className="section-heading"><span className="step">02</span><div><p className="eyebrow">Catálogo</p><h2>Agrega materiales</h2></div></div><div className="material-picker"><label className="material-select">Material<select value={selected} onChange={(e) => setSelected(e.target.value)}>{materials.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>{isPerFoot && <><label className="length-input">Medida<input type="number" min="0.01" step="0.01" value={length} onChange={(e) => setLength(e.target.value)} /></label><label className="length-unit">Unidad<select value={lengthUnit} onChange={(e) => setLengthUnit(e.target.value)}><option value="m">Metros (m)</option><option value="ft">Pies (ft)</option></select></label></>}<div className="unit-price"><small>Precio por lámina</small><strong>{money(pricePerPiece)}</strong><span>{isPerFoot ? `${money(material.price)}/ft x ${feet.toFixed(2)} ft` : material.unit}</span></div><label className="quantity">Cantidad<input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></label><button className="button button-orange" type="button" onClick={addToCart}>+ Agregar</button></div><p className="catalog-note">{isPerFoot ? `Precio calculado: ${money(material.price)} por pie x ${feet.toFixed(2)} pies = ${money(pricePerPiece)} por lámina. Subtotal: ${money(pricePerPiece * (Number(quantity) || 0))}.` : "Este producto se vende por pieza."}</p></section>;
}

function CalculadoraLaminas() {
  const { client, dimensions } = useContext(CotizacionContext);
  return <section className="sheet-calculator"><div><p className="eyebrow">Cálculo automático</p><h2>Material de cubierta</h2><p>Usamos láminas de 92 cm de ancho por hasta 8 m de largo.</p></div><div className="calculation"><div><strong>{dimensions.sheets || "--"}</strong><span>láminas necesarias</span></div><div><strong>{dimensions.rows || "--"}</strong><span>por fila</span></div><div><strong>{dimensions.columns || "--"}</strong><span>fila{dimensions.columns === 1 ? "" : "s"}</span></div></div>{client.width && client.length > 8 && <p className="error-text">El largo máximo permitido es de 8 m.</p>}</section>;
}

function ResumenCotizacion() {
  const { client, cart, removeMaterial, total, dimensions } = useContext(CotizacionContext);
  const sendWhatsApp = (event) => {
    event.preventDefault();
    if (!client.name || !client.phone || !client.width || !client.length || Number(client.length) > 8 || cart.length === 0) return;
    const detail = cart.map((item) => `- ${item.name}${item.displayUnit ? ` (${item.displayUnit})` : ""}: ${item.quantity} x ${money(item.price)} = ${money(item.price * item.quantity)}`).join("\n");
    const message = `Cotización de ${client.name}\nTeléfono: ${client.phone}\nDirección: ${client.address || "No indicada"}\nAncho x Largo: ${client.width}m x ${client.length}m\nTotal láminas necesarias: ${dimensions.sheets}\nDetalle de materiales:\n${detail}\nTotal: ${money(total)}\nObservaciones: ${client.observations || "Ninguna"}\nEnviar para confirmar pedido.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };
  return <section className="panel summary-panel"><div className="section-heading"><span className="step">03</span><div><p className="eyebrow">Vista previa</p><h2>Resumen de cotización</h2></div></div>{cart.length === 0 ? <div className="empty-cart">Tu cotización aparecerá aquí al agregar materiales.</div> : <div className="cart-list">{cart.map((item) => <div className="cart-item" key={item.id}><div><strong>{item.name}</strong><span>{item.quantity} x {money(item.price)} {item.displayUnit || item.unit}</span></div><b>{money(item.price * item.quantity)}</b><button type="button" aria-label={`Quitar ${item.name}`} onClick={() => removeMaterial(item.id)}>×</button></div>)}</div>}<div className="totals"><div className="total"><span>Total final</span><strong>{money(total)}</strong></div></div><div className="summary-actions"><button className="button button-outline" type="button" onClick={() => window.print()}>▣ Imprimir / PDF</button><button className="button button-whatsapp" type="button" onClick={sendWhatsApp}>↗ Confirmar por WhatsApp</button></div><p className="whatsapp-note">Al confirmar se abrirá WhatsApp con el detalle completo del pedido.</p></section>;
}

function NotaCotizacion() {
  const { client, cart, total, dimensions } = useContext(CotizacionContext);
  const today = new Date().toLocaleDateString("es-MX").split("/");
  return <section className="print-note" aria-label="Cotización en formato de nota"><img src="/nota-generada.svg" alt="Nota de cotización de Aceros y Lámina Americana" /><div className="note-folio">{String(Date.now()).slice(-3)}</div><div className="note-date"><span>{today[0]}</span><span>{today[1]}</span><span>{today[2]}</span></div><div className="note-client note-name">{client.name}</div><div className="note-client note-address">{client.address || "No indicada"}</div><div className="note-client note-phone">{client.phone}</div><div className="note-measures">{client.width} m x {client.length} m | {dimensions.sheets} láminas</div><div className="note-items">{cart.slice(0, 7).map((item) => <div className="note-item" key={item.id}><span>{item.quantity}</span><span>{item.name}{item.displayUnit ? ` - ${item.displayUnit}` : ""}</span><span>{wholeMoney(item.price)}</span><span>{wholeMoney(item.price * item.quantity)}</span></div>)}{cart.length > 7 && <div className="note-item"><span></span><span>+ {cart.length - 7} materiales más</span><span></span><span></span></div>}</div><div className="note-observations">{client.observations}</div><div className="note-total">{wholeMoney(total)}</div></section>;
}

function App() {
  return <CotizacionProvider><main className="app-shell"><header className="topbar"><div className="brand-mark">AA</div><div><p className="brand-name">Aceros y Lámina Americana</p><span className="brand-caption">Soluciones que construyen</span></div><div className="header-contact"><span>Atención directa</span><strong>618 218 7056</strong></div></header><section className="hero"><div><p className="eyebrow">Cotizador inteligente <span className="live-dot"></span></p><h1>Construye con precisión.</h1><p>Calcula tus materiales, conoce el precio exacto y recibe atención personalizada.</p></div><div className="hero-badge"><span>01</span><small>Define tus<br />medidas</small></div></section><div className="layout"><div className="main-column"><FormularioCliente /><CalculadoraLaminas /><SelectorMateriales /></div><aside><ResumenCotizacion /></aside></div><footer>ACEROS Y LÁMINA AMERICANA <span>·</span> Durango, México</footer></main><NotaCotizacion /></CotizacionProvider>;
}

export default App;

