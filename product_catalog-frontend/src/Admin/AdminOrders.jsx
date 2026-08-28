import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { generateInvoice } from "../utils/generateInvoice";

const COURIER_OPTIONS = ["Delhivery","BlueDart","DTDC","Shadowfax","Ekart","FedEx"];
const COURIER_URL_MAP = {
  BlueDart:"https://www.bluedart.com/tracking?numbers=",
  Delhivery:"https://www.delhivery.com/track/package/",
  DTDC:"https://www.dtdc.in/tracking/shipment-tracking.asp?awb=",
  Shadowfax:"https://tracker.shadowfax.in/#/track?awb=",
  Ekart:"https://ekartlogistics.com/track/",
  FedEx:"https://www.fedex.com/fedextrack/?trknbr=",
};
const STATUS_FLOW = ["PLACED","PROCESSING","SHIPPED","DELIVERED"];
const S_EMOJI = {PLACED:"📋",PROCESSING:"⚙️",SHIPPED:"🚚",DELIVERED:"✅",CANCELLED:"❌",REFUND_INITIATED:"💰"};
const S_COLOR = {
  DELIVERED:{bg:"#ecfdf5",c:"#059669",b:"#a7f3d0"},
  COMPLETED:{bg:"#ecfdf5",c:"#059669",b:"#a7f3d0"},
  SHIPPED:{bg:"#ecfeff",c:"#0891b2",b:"#a5f3fc"},
  PROCESSING:{bg:"#eef2ff",c:"#4f46e5",b:"#c7d2fe"},
  PLACED:{bg:"#fffbeb",c:"#d97706",b:"#fde68a"},
  PENDING:{bg:"#fffbeb",c:"#d97706",b:"#fde68a"},
  CANCELLED:{bg:"#fff1f2",c:"#e11d48",b:"#fecdd3"},
  REFUND_INITIATED:{bg:"#fdf4ff",c:"#7c3aed",b:"#e9d5ff"},
};

const fmt = n => Number(n||0).toLocaleString("en-IN",{minimumFractionDigits:2});
const fd = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "-";
const fdt = d => d ? new Date(d).toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "";

const SBadge = ({status}) => {
  const s = (status||"PLACED").toUpperCase();
  const c = S_COLOR[s]||{bg:"#f1f5f9",c:"#475569",b:"#cbd5e1"};
  return (
    <span style={{background:c.bg,color:c.c,border:`1px solid ${c.b}`,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,display:"inline-block"}}>
      {S_EMOJI[s]||""} {s}
    </span>
  );
};

const AdminOrders = () => {
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);
  const [error,setError] = useState("");
  const [search,setSearch] = useState("");
  const [statusFilter,setStatusFilter] = useState("ALL");
  const [selectedOrder,setSelectedOrder] = useState(null);
  const [activeTab,setActiveTab] = useState("shipping");
  const [savingShipping,setSavingShipping] = useState(false);
  const [cancelling,setCancelling] = useState(false);
  const [sf,setSf] = useState({status:"PLACED",courierName:"Delhivery",trackingNumber:"",trackingUrl:"",shippingFee:"0"});

  const fetchOrders = async () => {
    try {
      setError("");
      if (!loading) setRefreshing(true);
      const res = await api.get("/admin/orders");
      const data = res.data?.data||res.data||[];
      setOrders(Array.isArray(data)?data:[]);
    } catch(err) {
      setError(err.response?.data?.message||err.message||"Unable to load orders.");
    } finally {
      setLoading(false); setRefreshing(false);
    }
  };
  useEffect(() => { fetchOrders(); }, []);

  const openOrder = (order) => {
    setSelectedOrder(order); setActiveTab("shipping");
    setSf({
      status:order.orderStatus||"PLACED",
      courierName:order.courierName||"Delhivery",
      trackingNumber:order.trackingNumber||"",
      trackingUrl:order.trackingUrl||"",
      shippingFee:String(order.shippingFee??50),
    });
  };

  const handleCourierChange = (e) => {
    const c = e.target.value, base = COURIER_URL_MAP[c]||"";
    setSf(p => ({...p,courierName:c,trackingUrl:p.trackingNumber?`${base}${p.trackingNumber}`:p.trackingUrl}));
  };

  const handleTrackingChange = (e) => {
    const t = e.target.value, base = COURIER_URL_MAP[sf.courierName]||"";
    setSf(p => ({...p,trackingNumber:t,trackingUrl:t?`${base}${t}`:""}));
  };

  const handleAutoGen = () => {
    const c = sf.courierName||"Delhivery";
    const awb = `${c.substring(0,3).toUpperCase()}-${selectedOrder.id}-${Math.floor(100000000+Math.random()*900000000)}`;
    const base = COURIER_URL_MAP[c]||"";
    setSf(p => ({...p,trackingNumber:awb,trackingUrl:`${base}${awb}`,status:(p.status==="PLACED"||p.status==="PROCESSING")?"SHIPPED":p.status}));
  };

  const handleSaveShipping = async (e) => {
    e.preventDefault(); if (!selectedOrder) return;
    try {
      setSavingShipping(true);
      const params = new URLSearchParams({status:sf.status,courierName:sf.courierName,trackingNumber:sf.trackingNumber,trackingUrl:sf.trackingUrl});
      const res = await api.put(`/admin/orders/${selectedOrder.id}/shipping?${params.toString()}`);
      const updated = res.data?.data||res.data;
      Swal.fire({icon:"success",title:"Shipping Updated!",text:"Customer notified by email.",toast:true,position:"top-end",timer:2000,showConfirmButton:false});
      if (updated&&updated.id) setSelectedOrder(updated);
      await fetchOrders();
    } catch(err) {
      Swal.fire({icon:"error",title:"Update Failed",text:err.response?.data?.message||err.message});
    } finally { setSavingShipping(false); }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    const st = (selectedOrder.orderStatus||"").toUpperCase();
    if (st==="DELIVERED"||st==="CANCELLED") {
      Swal.fire({icon:"info",title:"Cannot Cancel",text:"Already delivered or cancelled."});
      return;
    }
    const {value:reason} = await Swal.fire({
      title:"Cancel This Order?",
      html:`<p><b>${selectedOrder.fullName||selectedOrder.userEmail}</b></p>
            <select id="cr" class="swal2-select" style="width:100%">
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="CUSTOMER_REQUEST">Customer Request</option>
              <option value="PAYMENT_FAILED">Payment Failed</option>
              <option value="FRAUD_SUSPECTED">Fraud Suspected</option>
              <option value="DUPLICATE_ORDER">Duplicate Order</option>
              <option value="OTHER">Other</option>
            </select>`,
      icon:"warning",showCancelButton:true,confirmButtonColor:"#e11d48",
      confirmButtonText:"Yes, Cancel & Notify",cancelButtonText:"Keep Order",
      preConfirm:() => document.getElementById("cr")?.value||"OTHER",
    });
    if (!reason) return;
    try {
      setCancelling(true);
      await api.post(`/orders/${selectedOrder.id}/cancel`,null,{params:{reason}});
      Swal.fire({icon:"success",title:"Order Cancelled",text:"Stock restored and email sent.",toast:true,position:"top-end",timer:2500,showConfirmButton:false});
      setSelectedOrder(null); await fetchOrders();
    } catch(err) {
      Swal.fire({icon:"error",title:"Cancel Failed",text:err.response?.data?.message||err.message});
    } finally { setCancelling(false); }
  };

  const handleInitiateRefund = async () => {
    if (!selectedOrder) return;
    const {isConfirmed} = await Swal.fire({
      title:"Initiate Refund?",
      html:`<p>Amount: <b>₹${fmt(selectedOrder.totalAmount)}</b><br/>Method: <b>${selectedOrder.paymentMethod||"COD"}</b></p>`,
      icon:"question",showCancelButton:true,confirmButtonColor:"#7c3aed",confirmButtonText:"Confirm Refund",
    });
    if (!isConfirmed) return;
    try {
      await api.put(`/admin/orders/${selectedOrder.id}/status?status=REFUND_INITIATED`);
      Swal.fire({icon:"success",title:"Refund Initiated",toast:true,position:"top-end",timer:2000,showConfirmButton:false});
      setSelectedOrder(null); await fetchOrders();
    } catch(err) {
      Swal.fire({icon:"error",title:"Failed",text:err.response?.data?.message||err.message});
    }
  };

  const filteredOrders = useMemo(() => orders.filter(o => {
    const q = search.toLowerCase();
    const ms = !search||String(o.id).includes(q)||o.orderNumber?.toLowerCase().includes(q)||o.fullName?.toLowerCase().includes(q)||o.userEmail?.toLowerCase().includes(q)||o.trackingNumber?.toLowerCase().includes(q);
    return ms&&(statusFilter==="ALL"||(o.orderStatus||"").toUpperCase()===statusFilter);
  }), [orders,search,statusFilter]);

  const stats = useMemo(() => {
    let p=0,pr=0,sh=0,dl=0,cx=0,rev=0;
    orders.forEach(o => {
      const s = (o.orderStatus||"").toUpperCase();
      if(s==="PLACED"||s==="PENDING") p++;
      else if(s==="PROCESSING") pr++;
      else if(s==="SHIPPED") sh++;
      else if(s==="DELIVERED"||s==="COMPLETED") dl++;
      else if(s==="CANCELLED") cx++;
      rev += Number(o.totalAmount||0);
    });
    return {total:orders.length,pending:p,processing:pr,shipped:sh,delivered:dl,cancelled:cx,revenue:rev};
  }, [orders]);

  const stepIdx = (status) => {
    const s = (status||"").toUpperCase();
    if (s==="CANCELLED") return -1;
    return STATUS_FLOW.indexOf(s);
  };

  const isCancelledOrDone = (s) => ["DELIVERED","CANCELLED"].includes((s||"").toUpperCase());
  const isRefundDone = (s) => ["DELIVERED","REFUND_INITIATED"].includes((s||"").toUpperCase());

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
      <div className="text-center">
        <div className="spinner-border mb-3" style={{color:"#6366f1"}}/>
        <p style={{color:"#64748b",fontWeight:600}}>Loading Orders...</p>
      </div>
    </div>
  );

  return (
    <div className="aop">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold m-0" style={{color:"#0f172a",fontSize:22}}>📦 Admin Shipping Management</h2>
          <p className="small m-0" style={{color:"#64748b"}}>View orders · change status · courier · tracking · refunds</p>
        </div>
        <button className="btn btn-outline-dark rounded-pill px-4 fw-semibold" onClick={fetchOrders} disabled={refreshing}>
          {refreshing?"🔄 Refreshing...":"⟳ Refresh"}
        </button>
      </div>

      {error && <div className="alert alert-danger rounded-3 mb-4">{error}</div>}

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {[
          {label:"Total",value:stats.total,color:"#0f172a",icon:"📋"},
          {label:"Placed",value:stats.pending,color:"#d97706",icon:"🟡"},
          {label:"Processing",value:stats.processing,color:"#4f46e5",icon:"⚙️"},
          {label:"Shipped",value:stats.shipped,color:"#0891b2",icon:"🚚"},
          {label:"Delivered",value:stats.delivered,color:"#059669",icon:"✅"},
          {label:"Cancelled",value:stats.cancelled,color:"#e11d48",icon:"❌"},
          {label:"Revenue",value:`₹${stats.revenue.toLocaleString("en-IN")}`,color:"#059669",icon:"💰"},
        ].map(card => (
          <div className="col-6 col-sm-4 col-lg" key={card.label}>
            <div className="aop-stat-card">
              <div className="aop-stat-icon">{card.icon}</div>
              <div className="aop-stat-val" style={{color:card.color}}>{card.value}</div>
              <div className="aop-stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="aop-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">🔍</span>
              <input className="form-control border-start-0" placeholder="Search by Order#, Name, Email, AWB..." value={search} onChange={e=>setSearch(e.target.value)}/>
              {search && <button className="btn btn-outline-secondary" onClick={()=>setSearch("")}>✕</button>}
            </div>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUND_INITIATED">Refund Initiated</option>
            </select>
          </div>
          <div className="col-6 col-md-2 text-end small" style={{color:"#64748b"}}>
            <b>{filteredOrders.length}</b> / <b>{orders.length}</b>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="aop-card overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table aop-table align-middle mb-0">
            <thead>
              <tr>
                <th>ORDER #</th><th>CUSTOMER</th><th>DATE</th><th>ITEMS</th>
                <th>AMOUNT</th><th>SHIPPING</th><th>STATUS</th><th>COURIER / AWB</th><th className="text-end">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length===0 ? (
                <tr><td colSpan={9} className="text-center py-5" style={{color:"#94a3b8"}}>No orders found.</td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id}>
                  <td><span className="fw-bold font-monospace" style={{color:"#0f172a",fontSize:12}}>{order.orderNumber||`#${order.id}`}</span></td>
                  <td>
                    <div className="fw-semibold" style={{fontSize:13,color:"#0f172a"}}>{order.fullName||"Customer"}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>{order.userEmail}</div>
                  </td>
                  <td style={{fontSize:12,color:"#475569"}}>{fd(order.orderDate)}</td>
                  <td style={{fontSize:12,color:"#475569",textAlign:"center"}}>{order.items?.length||order.orderItems?.length||"—"}</td>
                  <td><div className="fw-bold" style={{fontSize:13,color:"#0f172a"}}>₹{fmt(order.totalAmount)}</div></td>
                  <td style={{fontSize:12}}>
                    {Number(order.shippingFee||0)===0
                      ? <span style={{color:"#059669",fontWeight:700}}>FREE</span>
                      : <span style={{color:"#d97706",fontWeight:700}}>₹{fmt(order.shippingFee)}</span>}
                  </td>
                  <td><SBadge status={order.orderStatus}/></td>
                  <td>
                    {order.courierName ? (
                      <div>
                        <span className="badge bg-light border text-dark" style={{fontSize:10}}>{order.courierName}</span><br/>
                        <span className="font-monospace" style={{fontSize:10,color:"#475569"}}>{order.trackingNumber||"No AWB"}</span>
                      </div>
                    ) : <span style={{fontSize:11,color:"#94a3b8"}}>Unassigned</span>}
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm fw-semibold rounded-pill"
                      style={{background:"#0f172a",color:"#fff",fontSize:11,padding:"5px 14px"}}
                      onClick={()=>openOrder(order)}>
                      Manage ⚙
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER MANAGEMENT MODAL */}
      {selectedOrder && (
        <div className="aop-backdrop" onClick={()=>setSelectedOrder(null)}>
          <div className="aop-modal" onClick={e=>e.stopPropagation()}>

            {/* Modal Header */}
            <div className="aop-modal-header">
              <div>
                <h5 className="fw-bold m-0" style={{color:"#0f172a"}}>
                  📦 Order {selectedOrder.orderNumber||`#${selectedOrder.id}`}
                </h5>
                <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                  <SBadge status={selectedOrder.orderStatus}/>
                  <span style={{fontSize:11,color:"#94a3b8"}}>Placed {fdt(selectedOrder.orderDate)}</span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <button className="btn btn-sm rounded-pill"
                  style={{background:"#fef2f2",color:"#e11d48",border:"1px solid #fecdd3",fontSize:11,fontWeight:700}}
                  onClick={handleCancelOrder} disabled={cancelling||isCancelledOrDone(selectedOrder.orderStatus)}>
                  {cancelling?"Cancelling...":"❌ Cancel Order"}
                </button>
                <button className="btn btn-sm rounded-pill"
                  style={{background:"#faf5ff",color:"#7c3aed",border:"1px solid #e9d5ff",fontSize:11,fontWeight:700}}
                  onClick={handleInitiateRefund} disabled={isRefundDone(selectedOrder.orderStatus)}>
                  💰 Refund
                </button>
                <button className="btn btn-sm rounded-pill"
                  style={{background:"#f0fdf4",color:"#059669",border:"1px solid #a7f3d0",fontSize:11,fontWeight:700}}
                  onClick={()=>generateInvoice(selectedOrder)}>
                  📄 Invoice
                </button>
                <button className="btn-close" onClick={()=>setSelectedOrder(null)}/>
              </div>
            </div>

            {/* Delivery Stepper */}
            {(selectedOrder.orderStatus||"").toUpperCase()!=="CANCELLED" && (
              <div className="aop-stepper-wrap">
                {STATUS_FLOW.map((step,idx) => {
                  const active = stepIdx(selectedOrder.orderStatus);
                  const done = idx<=active, cur = idx===active;
                  return (
                    <React.Fragment key={step}>
                      <div className="aop-step">
                        <div className={`aop-step-circle${done?" done":""}${cur?" current":""}`}>
                          {done?"✓":idx+1}
                        </div>
                        <div className="aop-step-label">{step}</div>
                      </div>
                      {idx<STATUS_FLOW.length-1 && (
                        <div className={`aop-step-line${done&&idx<active?" done":""}`}/>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* 4 Info Cards */}
            <div className="row g-2 mb-3">
              <div className="col-md-6 col-lg-3">
                <div className="aop-info-card">
                  <div className="aop-info-title">👤 Customer</div>
                  <div className="aop-info-row"><b>Name:</b> {selectedOrder.fullName||"N/A"}</div>
                  <div className="aop-info-row"><b>Email:</b> {selectedOrder.userEmail}</div>
                  <div className="aop-info-row"><b>Phone:</b> {selectedOrder.mobile||"N/A"}</div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="aop-info-card">
                  <div className="aop-info-title">📍 Ship To</div>
                  <div className="aop-info-row">{selectedOrder.address||"N/A"}</div>
                  {selectedOrder.city&&<div className="aop-info-row"><b>City:</b> {selectedOrder.city}</div>}
                  {selectedOrder.pincode&&<div className="aop-info-row"><b>PIN:</b> {selectedOrder.pincode}</div>}
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="aop-info-card">
                  <div className="aop-info-title">💳 Payment</div>
                  <div className="aop-info-row"><b>Method:</b> {selectedOrder.paymentMethod||"COD"}</div>
                  <div className="aop-info-row"><b>Status:</b> <span className="badge bg-info-subtle text-info">{selectedOrder.paymentStatus||"PENDING"}</span></div>
                  {selectedOrder.razorpayPaymentId&&<div className="aop-info-row" style={{fontSize:10}}><b>ID:</b> {selectedOrder.razorpayPaymentId}</div>}
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="aop-info-card">
                  <div className="aop-info-title">🧾 Summary</div>
                  <div className="aop-info-row d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>₹{fmt(Number(selectedOrder.totalAmount||0)-Number(selectedOrder.shippingFee||0))}</span>
                  </div>
                  <div className="aop-info-row d-flex justify-content-between">
                    <span>Shipping</span>
                    <span style={{color:Number(selectedOrder.shippingFee||0)===0?"#059669":"#d97706"}}>
                      {Number(selectedOrder.shippingFee||0)===0?"FREE":`₹${fmt(selectedOrder.shippingFee)}`}
                    </span>
                  </div>
                  <div className="aop-info-row d-flex justify-content-between fw-bold" style={{borderTop:"1px solid #e2e8f0",marginTop:4,paddingTop:4}}>
                    <span>Total</span><span style={{color:"#0f172a"}}>₹{fmt(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="aop-tabs mb-3">
              {[
                {key:"shipping",label:"🚚 Shipping Management"},
                {key:"items",label:`📦 Items (${(selectedOrder.items||selectedOrder.orderItems||[]).length})`},
                {key:"history",label:`📜 History (${(selectedOrder.orderHistories||[]).length})`},
              ].map(t=>(
                <button key={t.key} className={`aop-tab${activeTab===t.key?" active":""}`} onClick={()=>setActiveTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab: Shipping */}
            {activeTab==="shipping" && (
              <form onSubmit={handleSaveShipping} className="aop-form-card">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="aop-label">Order Status *</label>
                    <select className="form-select" value={sf.status} onChange={e=>setSf(p=>({...p,status:e.target.value}))}>
                      <option value="PLACED">📋 PLACED</option>
                      <option value="PROCESSING">⚙️ PROCESSING</option>
                      <option value="SHIPPED">🚚 SHIPPED</option>
                      <option value="DELIVERED">✅ DELIVERED</option>
                      <option value="CANCELLED">❌ CANCELLED</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="aop-label">Courier Partner</label>
                    <select className="form-select" value={sf.courierName} onChange={handleCourierChange}>
                      {COURIER_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-7">
                    <label className="aop-label">Tracking Number (AWB)</label>
                    <input className="form-control font-monospace" placeholder="e.g. DEL-104-983744321" value={sf.trackingNumber} onChange={handleTrackingChange}/>
                  </div>
                  <div className="col-md-5 d-flex align-items-end">
                    <button type="button" className="btn w-100 fw-semibold"
                      style={{background:"#eff6ff",color:"#2563eb",border:"1px solid #bfdbfe"}}
                      onClick={handleAutoGen}>
                      ⚡ Auto Generate AWB
                    </button>
                  </div>
                  <div className="col-12">
                    <label className="aop-label">Tracking URL</label>
                    <div className="input-group">
                      <input className="form-control" placeholder="https://..." value={sf.trackingUrl}
                        onChange={e=>setSf(p=>({...p,trackingUrl:e.target.value}))}/>
                      {sf.trackingUrl&&<a href={sf.trackingUrl} target="_blank" rel="noreferrer" className="btn btn-outline-secondary">🔗</a>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="aop-label">Shipping Charge (₹)</label>
                    <input className="form-control" type="number" min="0" step="0.01" value={sf.shippingFee}
                      onChange={e=>setSf(p=>({...p,shippingFee:e.target.value}))}/>
                    <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>Free above ₹500 — set 0 for free shipping</div>
                  </div>
                  <div className="col-md-8 d-flex align-items-end">
                    <div className="alert alert-info py-2 px-3 m-0 w-100" style={{fontSize:12}}>
                      💡 Saving updates order status and emails the customer with tracking info.
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-3 pt-3 border-top">
                  <button type="submit" className="btn fw-semibold rounded-pill px-5"
                    style={{background:"#0f172a",color:"#fff"}} disabled={savingShipping}>
                    {savingShipping?"⏳ Saving...":"💾 Save & Notify Customer"}
                  </button>
                </div>
              </form>
            )}

            {/* Tab: Items */}
            {activeTab==="items" && (
              <div className="aop-form-card p-0 overflow-hidden">
                <table className="table aop-table align-middle mb-0">
                  <thead>
                    <tr><th style={{width:60}}>IMG</th><th>PRODUCT</th><th className="text-center">QTY</th><th className="text-end">PRICE</th><th className="text-end">SUBTOTAL</th></tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items||selectedOrder.orderItems||[]).length===0 ? (
                      <tr><td colSpan={5} className="text-center py-4" style={{color:"#94a3b8"}}>No items available.</td></tr>
                    ) : (selectedOrder.items||selectedOrder.orderItems||[]).map((item,idx)=>(
                      <tr key={idx}>
                        <td>
                          {item.imageUrl
                            ? <img src={item.imageUrl} alt={item.name} style={{width:44,height:44,objectFit:"cover",borderRadius:8,border:"1px solid #e2e8f0"}}/>
                            : <div style={{width:44,height:44,background:"#f1f5f9",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📦</div>}
                        </td>
                        <td><div style={{fontWeight:600,fontSize:13,color:"#0f172a"}}>{item.productName||item.name||"Product"}</div></td>
                        <td className="text-center">
                          <span style={{background:"#f1f5f9",padding:"2px 10px",borderRadius:20,fontWeight:700,fontSize:13}}>{item.quantity}</span>
                        </td>
                        <td className="text-end" style={{fontSize:13}}>₹{fmt(item.price||item.unitPrice)}</td>
                        <td className="text-end fw-bold" style={{fontSize:13,color:"#0f172a"}}>
                          ₹{fmt((item.price||item.unitPrice||0)*(item.quantity||1))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{background:"#f8fafc"}}>
                      <td colSpan={4} className="text-end fw-bold" style={{fontSize:13}}>Shipping</td>
                      <td className="text-end fw-bold" style={{fontSize:13,color:Number(selectedOrder.shippingFee||0)===0?"#059669":"#d97706"}}>
                        {Number(selectedOrder.shippingFee||0)===0?"FREE":`₹${fmt(selectedOrder.shippingFee)}`}
                      </td>
                    </tr>
                    <tr style={{background:"#f0fdf4"}}>
                      <td colSpan={4} className="text-end fw-bold" style={{fontSize:14}}>Grand Total</td>
                      <td className="text-end fw-bold" style={{fontSize:15,color:"#059669"}}>₹{fmt(selectedOrder.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Tab: History */}
            {activeTab==="history" && (
              <div className="aop-form-card">
                {(!selectedOrder.orderHistories||selectedOrder.orderHistories.length===0) ? (
                  <div className="text-center py-4" style={{color:"#94a3b8"}}>
                    <div style={{fontSize:32}}>📭</div>
                    <p className="mt-2 mb-0">No delivery history yet.</p>
                  </div>
                ) : (
                  <div className="aop-timeline">
                    {[...selectedOrder.orderHistories].reverse().map((h,idx)=>(
                      <div key={idx} className="aop-timeline-item">
                        <div className="aop-timeline-dot" style={{background:S_COLOR[(h.status||"").toUpperCase()]?.c||"#6366f1"}}>
                          {S_EMOJI[(h.status||"").toUpperCase()]||"•"}
                        </div>
                        <div className="aop-timeline-content">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <span className="fw-bold" style={{fontSize:13,color:"#0f172a"}}>{h.status}</span>
                              {h.location&&<span style={{fontSize:11,color:"#64748b",marginLeft:6}}>📍{h.location}</span>}
                            </div>
                            <span style={{fontSize:11,color:"#94a3b8",whiteSpace:"nowrap",marginLeft:8}}>{fdt(h.timestamp)}</span>
                          </div>
                          {h.notes&&<div style={{fontSize:12,color:"#475569",marginTop:2}}>{h.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      <style>{`
        .aop{padding:28px;background:#f8fafc;min-height:100vh;}
        .aop-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.04);}
        .aop-form-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.03);}
        .aop-stat-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px 12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.03);}
        .aop-stat-icon{font-size:20px;margin-bottom:4px;}
        .aop-stat-val{font-size:20px;font-weight:800;line-height:1.2;}
        .aop-stat-label{font-size:10px;font-weight:600;color:#64748b;text-transform:uppercase;margin-top:2px;}
        .aop-table th{font-size:10px;font-weight:700;color:#475569;letter-spacing:.5px;padding:12px 14px;background:#f8fafc;border-bottom:2px solid #e2e8f0;}
        .aop-table td{padding:12px 14px;font-size:12px;border-color:#f1f5f9;}
        .aop-table tbody tr:hover{background:#fafbfc;}
        .aop-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.65);backdrop-filter:blur(6px);display:flex;align-items:flex-start;justify-content:center;z-index:1060;padding:20px;overflow-y:auto;}
        .aop-modal{width:100%;max-width:860px;background:#fff;border-radius:20px;padding:24px;box-shadow:0 30px 80px rgba(0,0,0,.25);margin:auto;}
        .aop-modal-header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid #e2e8f0;margin-bottom:16px;flex-wrap:wrap;gap:12px;}
        .aop-stepper-wrap{display:flex;align-items:center;justify-content:center;padding:16px 12px;background:#f8fafc;border-radius:12px;margin-bottom:16px;overflow-x:auto;}
        .aop-step{display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0;}
        .aop-step-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;background:#e2e8f0;color:#64748b;border:2px solid #e2e8f0;}
        .aop-step-circle.done{background:#059669;color:#fff;border-color:#059669;}
        .aop-step-circle.current{background:#10b981;color:#fff;border-color:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.2);}
        .aop-step-label{font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.5px;}
        .aop-step-line{flex:1;height:2px;background:#e2e8f0;min-width:20px;max-width:80px;}
        .aop-step-line.done{background:#059669;}
        .aop-info-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px;height:100%;}
        .aop-info-title{font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;margin-bottom:8px;letter-spacing:.5px;}
        .aop-info-row{font-size:12px;color:#334155;margin-bottom:3px;}
        .aop-tabs{display:flex;gap:4px;background:#f1f5f9;padding:4px;border-radius:12px;}
        .aop-tab{flex:1;padding:8px 12px;border:none;border-radius:8px;font-size:12px;font-weight:600;color:#64748b;background:transparent;cursor:pointer;white-space:nowrap;}
        .aop-tab.active{background:#fff;color:#0f172a;box-shadow:0 1px 6px rgba(0,0,0,.08);}
        .aop-label{font-size:12px;font-weight:700;color:#374151;margin-bottom:4px;display:block;}
        .aop-timeline{display:flex;flex-direction:column;gap:0;}
        .aop-timeline-item{display:flex;gap:12px;padding-bottom:16px;position:relative;}
        .aop-timeline-item:not(:last-child)::before{content:'';position:absolute;left:15px;top:28px;width:2px;height:calc(100% - 12px);background:#e2e8f0;}
        .aop-timeline-dot{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;}
        .aop-timeline-content{flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px 14px;}
      `}</style>
    </div>
  );
};

export default AdminOrders;
