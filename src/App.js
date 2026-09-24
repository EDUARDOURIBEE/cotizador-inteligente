import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import "./App.css";
import CotizacionPDF from "./CotizacionPDF";

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

function CotizacionProvider({ children }) {
  const [client, setClient] = useState({ name: "", phone: "", address: "", width: "", length: "", waters: "", observations: "" });
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
  const dimensions = useMemo(() => {
    const width = Number(client.width) || 0;
    const length = Number(client.length) || 0;
    const waters = Number(client.waters) || 0;
    const area = width * length;
    const sheetLength = Math.min(3.1, 8);
    const areaPerWater = waters ? area / waters : 0;
    const sheetsPerWater = areaPerWater ? Math.ceil(areaPerWater / (0.92 * sheetLength)) : 0;
    const baseSheets = sheetsPerWater * waters;
    const sheets = baseSheets ? baseSheets + 1 : 0;
    const polines = waters ? Math.ceil(length / 1.5) * waters : 0;
    const ptr = waters ? Math.ceil(width / 2) * waters : 0;
    const channels = waters ? waters * 2 : 0;
    const screws = sheets * 12;
    return { width, length, waters, area, sheetLength, areaPerWater, sheetsPerWater, baseSheets, sheets, polines, ptr, channels, screws };
  }, [client.width, client.length, client.waters]);
  const recommendations = useMemo(() => {
    if (!dimensions.sheets) return [];
    const sheetFeet = dimensions.sheetLength * 3.28084;
    const sheetPrice = 68 * sheetFeet;
    const ridgePrice = 55 * dimensions.width * 3.28084;
    const channelPrice = 55 * 3.28084;
    const polinPrice = 750;
    const ptrPrice = 660;
    const screwPrice = 4;
    return [
      { id: "recommended-sheets", name: "LÁMINA COLOR 26", quantity: dimensions.sheets, measure: `${dimensions.sheetLength.toFixed(2)} m`, price: sheetPrice, unit: "pieza", category: "lamina" },
      { id: "recommended-ridges", name: "CABALLETE COLOR", quantity: dimensions.waters, measure: `${dimensions.width.toFixed(2)} m`, price: ridgePrice, unit: "pieza" },
      { id: "recommended-polines", name: "POLÍN 4 x 2 C.14", quantity: dimensions.polines, measure: "6 m", price: polinPrice, unit: "pieza", category: "polin" },
      { id: "recommended-ptr", name: "PTR 2 x 2 C.14", quantity: dimensions.ptr, measure: "6 m", price: ptrPrice, unit: "pieza", category: "ptr" },
      { id: "recommended-channels", name: "CANAL COLOR", quantity: dimensions.channels, measure: "3 m", price: channelPrice, unit: "pieza" },
      { id: "recommended-screws", name: "PIJAS VARIAS", quantity: dimensions.screws, measure: "3/4 a 3 in", price: screwPrice, unit: "pieza" },
    ];
  }, [dimensions]);
  const manualSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = manualSubtotal;
  const total = subtotal;
  return <CotizacionContext.Provider value={{ client, updateClient, cart, addMaterial, removeMaterial, subtotal, recommendations, total, dimensions }}>{children}</CotizacionContext.Provider>;
}

function FormularioCliente() {
  const { client, updateClient } = useContext(CotizacionContext);
  return <section className="panel client-panel"><div className="section-heading"><span className="step">01</span><div><p className="eyebrow">Datos del cliente</p><h2>¿Para quién cotizamos?</h2></div></div><div className="form-grid">
    <label>Nombre completo<input required value={client.name} onChange={(e) => updateClient("name", e.target.value)} placeholder="Ej. Juan Pérez" /></label>
    <label>Teléfono<input required type="tel" value={client.phone} onChange={(e) => updateClient("phone", e.target.value)} placeholder="10 dígitos" /></label>
    <label className="wide">Dirección <span>(opcional)</span><input value={client.address} onChange={(e) => updateClient("address", e.target.value)} placeholder="Calle, número y colonia" /></label>
    <label>Ancho (m)<input required type="number" min="0.01" step="0.01" value={client.width} onChange={(e) => updateClient("width", e.target.value)} placeholder="0.00" /></label>
    <label>Largo (m)<input required type="number" min="0.01" max="8" step="0.01" value={client.length} onChange={(e) => updateClient("length", e.target.value)} placeholder="Máximo 8 m" /></label>
    <label>Número de aguas<select required value={client.waters} onChange={(e) => updateClient("waters", e.target.value)}><option value="">Selecciona</option><option value="1">1 agua</option><option value="2">2 aguas</option><option value="3">3 aguas</option><option value="4">4 aguas</option></select></label>
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
  const { client, dimensions, recommendations, addMaterial } = useContext(CotizacionContext);
  const [edits, setEdits] = useState({});
  const getEdit = (item) => edits[item.id] || { name: item.name, quantity: item.quantity, measure: item.measure, materialId: item.id };
  const updateEdit = (item, field, value) => setEdits((current) => ({ ...current, [item.id]: { ...getEdit(item), [field]: value } }));
  const optionsFor = (item) => {
    if (item.category === "polin") return materials.filter((material) => material.id.includes("polin"));
    if (item.category === "ptr") return materials.filter((material) => material.id.includes("ptr"));
    if (item.category === "lamina") return materials.filter((material) => material.unit === "/ft");
    if (item.name.includes("CANAL")) return materials.filter((material) => material.name.includes("CANAL") && material.unit === "/ft");
    if (item.name.includes("CABALLETE")) return materials.filter((material) => material.name.includes("CABALLETE") && material.unit === "/ft");
    return materials.filter((material) => material.id === "pijas");
  };
  const confirmRecommendation = (item) => {
    const edit = getEdit(item);
    const selectedMaterial = materials.find((material) => material.id === edit.materialId) || item;
    const quantity = Math.max(1, Number(edit.quantity) || 1);
    const measure = edit.measure || item.measure;
    const numericMeasure = Number.parseFloat(measure) || 0;
    const price = selectedMaterial.unit === "/ft" ? selectedMaterial.price * numericMeasure * 3.28084 : selectedMaterial.price;
    addMaterial({ ...selectedMaterial, id: `recommended-${item.id}-${Date.now()}`, price, displayUnit: measure, basePrice: selectedMaterial.price }, quantity);
  };
  return <section className="sheet-calculator"><div><p className="eyebrow">Cálculo automático</p><h2>Materiales recomendados</h2><p>Calculado por área para {dimensions.waters || "--"} aguas. Revisa y confirma cada material.</p></div><div className="calculation"><div><strong>{dimensions.sheets || "--"}</strong><span>láminas</span></div><div><strong>{dimensions.polines || "--"}</strong><span>polines</span></div><div><strong>{dimensions.ptr || "--"}</strong><span>PTR</span></div></div>{client.width && client.length > 8 && <p className="error-text">El largo máximo permitido es de 8 m.</p>}<div className="recommendation-table-wrap"><table className="recommendation-table"><thead><tr><th>Material</th><th>Cantidad</th><th>Medida sugerida</th><th>Precio unitario</th><th>Subtotal</th><th>Acción</th></tr></thead><tbody>{recommendations.length ? recommendations.map((item) => { const edit = getEdit(item); const selectedMaterial = materials.find((material) => material.id === edit.materialId) || item; const price = selectedMaterial.unit === "/ft" ? selectedMaterial.price * (Number.parseFloat(edit.measure) || 0) * 3.28084 : selectedMaterial.price; return <tr key={item.id}><td><select value={edit.materialId} onChange={(e) => updateEdit(item, "materialId", e.target.value)}>{optionsFor(item).map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></td><td><input className="recommendation-input" type="number" min="1" value={edit.quantity} onChange={(e) => updateEdit(item, "quantity", e.target.value)} /></td><td><input className="recommendation-input" type="text" value={edit.measure} onChange={(e) => updateEdit(item, "measure", e.target.value)} /></td><td>{money(price)}</td><td>{money(price * (Number(edit.quantity) || 0))}</td><td><button className="button button-orange recommendation-button" type="button" onClick={() => confirmRecommendation(item)}>Agregar a cotización</button></td></tr>; }) : <tr><td colSpan="6">Ingresa ancho, largo y número de aguas para calcular.</td></tr>}</tbody></table></div></section>;
}

function ResumenCotizacion({ onPrint }) {
  const { client, cart, removeMaterial, total, dimensions } = useContext(CotizacionContext);
  const sendWhatsApp = (event) => {
    event.preventDefault();
    if (!client.name || !client.phone || !client.width || !client.length || Number(client.length) > 8 || cart.length === 0) return;
    const manualDetail = cart.map((item) => `- ${item.name}${item.displayUnit ? ` (${item.displayUnit})` : ""}: ${item.quantity} x ${money(item.price)} = ${money(item.price * item.quantity)}`);
    const message = `Cotización de ${client.name}\nTeléfono: ${client.phone}\nDirección: ${client.address || "No indicada"}\nAncho x Largo: ${client.width}m x ${client.length}m\nNúmero de aguas: ${client.waters}\nTotal láminas necesarias: ${dimensions.sheets}\nMateriales confirmados:\n${manualDetail.join("\n") || "Ninguno"}\nTotal: ${money(total)}\nObservaciones: ${client.observations || "Ninguna"}\nEnviar para confirmar pedido.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };
  return <section className="panel summary-panel"><div className="section-heading"><span className="step">03</span><div><p className="eyebrow">Vista previa</p><h2>Resumen de cotización</h2></div></div><div className="summary-water-info">{dimensions.waters ? `${dimensions.waters} aguas · ${dimensions.sheets} láminas · ${dimensions.screws} pijas` : "Define las medidas para calcular"}</div>{cart.length > 0 && <div className="cart-list">{cart.map((item) => <div className="cart-item" key={item.id}><div><strong>{item.name}</strong><span>{item.quantity} x {money(item.price)} {item.displayUnit || item.unit}</span></div><b>{money(item.price * item.quantity)}</b><button type="button" aria-label={`Quitar ${item.name}`} onClick={() => removeMaterial(item.id)}>×</button></div>)}</div>}<div className="totals"><div className="total"><span>Total materiales</span><strong>{money(total)}</strong></div></div><div className="summary-actions"><button className="button button-outline" type="button" onClick={onPrint}>▣ Imprimir / Descargar PDF</button><button className="button button-whatsapp" type="button" onClick={sendWhatsApp}>↗ Confirmar por WhatsApp</button></div><p className="whatsapp-note">Se abrirá el diálogo para imprimir o guardar la cotización como PDF.</p></section>;
}

function CotizacionPage() {
  const { client, cart, total, dimensions } = useContext(CotizacionContext);
  const componentRef = useRef(null);
  const print = useReactToPrint({ contentRef: componentRef, documentTitle: `Cotizacion-${client.name || "cliente"}` });

  return <><main className="app-shell"><header className="topbar"><div className="brand-mark">AA</div><div><p className="brand-name">Aceros y Lámina Americana</p><span className="brand-caption">Soluciones que construyen</span></div><div className="header-contact"><span>Atención directa</span><strong>618 218 7056</strong></div></header><section className="hero"><div><p className="eyebrow">Cotizador inteligente <span className="live-dot"></span></p><h1>Construye con precisión.</h1><p>Calcula tus materiales, conoce el precio exacto y recibe atención personalizada.</p></div><div className="hero-badge"><span>01</span><small>Define tus<br />medidas</small></div></section><div className="layout"><div className="main-column"><FormularioCliente /><CalculadoraLaminas /><SelectorMateriales /></div><aside><ResumenCotizacion onPrint={print} /></aside></div><footer>ACEROS Y LÁMINA AMERICANA <span>·</span> Durango, México</footer></main><CotizacionPDF ref={componentRef} client={client} cart={cart} total={total} dimensions={dimensions} /></>;
}

function App() {
  return <CotizacionProvider><CotizacionPage /></CotizacionProvider>;
}

export default App;

